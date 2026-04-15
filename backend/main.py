import os
import json
import random
import stripe
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from database import supabase

load_dotenv()

app = FastAPI()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Allow both local dev and production frontend
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    FRONTEND_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FIX 1: Delivery fee in cents to match Stripe (SGD 5.00 = 500 cents)
# and matches DELIVERY_FEE = 5.00 in your CartContext (dollars)
DELIVERY_FEE_CENTS = 500  # SGD 5.00
FREE_SLEEVE_OPTIONS = [
    "Plain Sleeve (Midnight Black)",
    "Plain Sleeve (Pearl White)",
]

def build_promotional_items(items: list, is_member: bool) -> list:
    total_10ml = 0
    total_50ml = 0

    for item in items:
        qty = int(item.get("quantity", 0) or 0)
        variant = str(item.get("variant", "")).lower()
        if variant == "10ml":
            total_10ml += qty
        elif variant == "50ml":
            total_50ml += qty

    promo_items = []

    if total_10ml > 0:
        sleeve_counts = {name: 0 for name in FREE_SLEEVE_OPTIONS}
        for _ in range(total_10ml):
            sleeve_counts[random.choice(FREE_SLEEVE_OPTIONS)] += 1

        for name, qty in sleeve_counts.items():
            if qty > 0:
                promo_items.append({
                    "name": name,
                    "price": 0,
                    "quantity": qty,
                    "variant": "promo-gift",
                    "is_free_gift": True,
                })

    if is_member and total_50ml > 0:
        promo_items.append({
            "name": "1.5ml Tester",
            "price": 0,
            "quantity": total_50ml,
            "variant": "promo-gift",
            "is_free_gift": True,
        })

    return promo_items


# -----------------------------
# ROOT
# -----------------------------
@app.get("/")
def read_root():
    return {"message": "Welcome to the Youthentic API!"}


# -----------------------------
# GET PRODUCTS
# -----------------------------
@app.get("/products")
def get_products():
    response = supabase.table("products").select("*").execute()
    return response.data


# -----------------------------
# USER MANAGEMENT
# -----------------------------
@app.post("/users")
async def create_user(user: dict):
    email = user.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    existing = supabase.table("users").select("*").eq("email", email).execute()
    if existing.data:
        return existing.data[0]

    response = supabase.table("users").insert({
        "email": email,
        "loyalty_points": 0,
    }).execute()
    return response.data[0]


# FIX 2: Add loyalty fetch endpoint (used by LoyaltyContext.fetchLoyalty)
@app.get("/users/loyalty")
def get_loyalty(email: str):
    user = supabase.table("users").select("loyalty_points, created_at").eq("email", email).execute()
    if not user.data:
        raise HTTPException(status_code=404, detail="User not found")
    return user.data[0]


# FIX 3: Add loyalty earn endpoint (used by LoyaltyContext.earnPoints)
@app.post("/users/loyalty/earn")
async def earn_loyalty(data: dict):
    email          = data.get("email")
    new_total      = data.get("new_total")

    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    supabase.table("users").update({
        "loyalty_points": new_total,
    }).eq("email", email).execute()

    return {"loyalty_points": new_total}


# -----------------------------
# CREATE CHECKOUT SESSION
# FIX 4: prices from frontend are in dollars (e.g. 38.0),
#         Stripe needs cents (3800). Convert here.
# FIX 5: pass deliveryOption + cart items through metadata
#         so the webhook can save them correctly.
# -----------------------------
@app.post("/create-checkout-session")
async def create_checkout_session(data: dict):
    items           = data.get("items", [])
    delivery_option = data.get("deliveryOption", "self")
    is_member       = bool(data.get("isMember", False))

    if not items:
        raise HTTPException(status_code=400, detail="No items in cart")

    line_items = []
    promo_items = build_promotional_items(items, is_member)

    for item in items:
        # FIX 4: price comes in as dollars → multiply by 100 for Stripe cents
        unit_amount_cents = round(float(item["price"]) * 100)

        # Build a descriptive name including variant if present
        name = item["name"]
        if item.get("variant") and item["variant"] != "bundle":
            name = f"{item['name']} ({item['variant']})"
        elif item.get("variant") == "bundle":
            selections = item.get("bundleSelections") or []
            if isinstance(selections, list) and selections:
                preview = ", ".join(selections[:3])
                if len(selections) > 3:
                    preview += ", ..."
                name = f"{item['name']} – Bundle ({preview})"
            else:
                name = f"{item['name']} – Bundle"

        line_items.append({
            "price_data": {
                "currency": "sgd",
                "product_data": {"name": name},
                "unit_amount": unit_amount_cents,
            },
            "quantity": item["quantity"],
        })

    if delivery_option == "delivery":
        line_items.append({
            "price_data": {
                "currency": "sgd",
                "product_data": {"name": "Home Delivery"},
                "unit_amount": DELIVERY_FEE_CENTS,
            },
            "quantity": 1,
        })

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=line_items,
        mode="payment",
        # FIX 5: store cart data in metadata so webhook can retrieve it
        metadata={
            "delivery_option": delivery_option,
            "is_member": str(is_member).lower(),
            "items": json.dumps([
                {
                    "name":     i["name"],
                    "price":    i["price"],
                    "quantity": i["quantity"],
                    "variant":  i.get("variant", ""),
                    "bundleSelections": i.get("bundleSelections", []),
                }
                for i in items
            ] + promo_items),
        },
        # Collect email at checkout so we have it in the webhook
        customer_email=None,  # leave None — Stripe will collect it on the form
        success_url=f"{FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{FRONTEND_URL}/cancel",
    )

    # Return the hosted checkout URL — frontend redirects directly to it
    print(f"Stripe session id: {session.id}")
    print(f"Stripe session url: {session.url}")

    if not session.url:
        # Fallback: construct the hosted URL manually
        url = f"https://checkout.stripe.com/pay/{session.id}"
    else:
        url = session.url

    return {"id": session.id, "url": url}


# -----------------------------
# STRIPE WEBHOOK
# FIX 6: retrieve full session with line_items expanded
#         (session object in webhook doesn't include line_items by default)
# FIX 7: read items + delivery_option from metadata we stored above
# FIX 8: correct tier thresholds (500 Silver, 2000 Gold)
# FIX 9: points = 1 per SGD, not per cent (amount_total is in cents)
# -----------------------------
@app.post("/webhook")
async def stripe_webhook(request: Request):
    payload    = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        # FIX 6: retrieve full session to get customer email reliably
        full_session = stripe.checkout.Session.retrieve(
            session["id"],
            expand=["line_items"]
        )

        email           = full_session.get("customer_details", {}).get("email")
        amount_cents    = full_session.get("amount_total", 0)      # cents
        amount_sgd      = amount_cents / 100                        # dollars
        delivery_option = full_session["metadata"].get("delivery_option", "self")

        # FIX 7: parse items from metadata
        try:
            items = json.loads(full_session["metadata"].get("items", "[]"))
        except Exception:
            items = []

        # Save order
        # total_amount stored as integer cents to match schema (integer column)
        # items serialised to JSON string for jsonb column
        order_result = supabase.table("orders").insert({
            "email":             email,
            "items":             json.dumps(items),   # jsonb needs a string
            "total_amount":      int(amount_cents),   # integer column — store cents
            "delivery_option":   delivery_option,
            "stripe_session_id": full_session["id"],
            "payment_status":    "paid",
        }).execute()
        print(f"Order saved: {order_result.data}")

        # Update loyalty
        if email:
            user = supabase.table("users").select("*").eq("email", email).execute()

            if user.data:
                current_points = user.data[0]["loyalty_points"] or 0
                # FIX 9: 1 point per SGD (not per cent)
                earned_points  = int(amount_sgd)
                new_points     = current_points + earned_points

                supabase.table("users").update({
                    "loyalty_points": new_points,
                }).eq("email", email).execute()
            else:
                # Auto-create user if they checked out as guest
                earned_points = int(amount_sgd)
                supabase.table("users").insert({
                    "email":          email,
                    "loyalty_points": earned_points,
                }).execute()

    return {"status": "success"}


# -----------------------------
# USER ORDERS
# -----------------------------
@app.get("/orders")
def get_user_orders(email: str):
    response = (
        supabase
        .table("orders")
        .select("*")
        .eq("email", email)
        .order("created_at", desc=True)
        .execute()
    )

    orders = response.data or []

    # Ensure `items` is always an array for frontend rendering.
    for order in orders:
        if isinstance(order.get("items"), str):
            try:
                order["items"] = json.loads(order["items"])
            except Exception:
                order["items"] = []

    return orders


# -----------------------------
# ADMIN ORDERS
# -----------------------------
@app.get("/admin/orders")
def get_orders():
    response = supabase.table("orders").select("*").order("created_at", desc=True).execute()
    return response.data


# FIX 10: Add the PATCH route Admin.js needs for status updates
@app.patch("/admin/orders/{order_id}")
async def update_order(order_id: str, data: dict):
    payment_status = data.get("payment_status")
    if not payment_status:
        raise HTTPException(status_code=400, detail="payment_status is required")

    response = supabase.table("orders").update({
        "payment_status": payment_status
    }).eq("id", order_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Order not found")

    return response.data[0]