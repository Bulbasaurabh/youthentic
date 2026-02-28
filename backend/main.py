import os
import stripe
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from database import supabase

load_dotenv()

app = FastAPI()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

FRONTEND_URL = "http://localhost:3000"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DELIVERY_FEE = 200  # $2

# -----------------------------
# GET PRODUCTS
# -----------------------------
@app.get("/")
def read_root():
    return {"message": "Welcome to the Youthentic API!"}

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

    existing = supabase.table("users").select("*").eq("email", email).execute()

    if existing.data:
        return existing.data[0]

    new_user = {
        "email": email,
        "loyalty_points": 0,
        "tier": "Bronze"
    }

    response = supabase.table("users").insert(new_user).execute()
    return response.data[0]


# -----------------------------
# CREATE CHECKOUT SESSION
# -----------------------------
@app.post("/create-checkout-session")
async def create_checkout_session(data: dict):
    items = data.get("items")
    delivery_option = data.get("deliveryOption")

    line_items = []

    total = 0

    for item in items:
        line_items.append({
            "price_data": {
                "currency": "sgd",
                "product_data": {
                    "name": item["name"]
                },
                "unit_amount": item["price"]
            },
            "quantity": item["quantity"]
        })

        total += item["price"] * item["quantity"]

    if delivery_option == "delivery":
        line_items.append({
            "price_data": {
                "currency": "sgd",
                "product_data": {
                    "name": "Home Delivery"
                },
                "unit_amount": DELIVERY_FEE
            },
            "quantity": 1
        })

        total += DELIVERY_FEE

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=line_items,
        mode="payment",
        success_url=f"{FRONTEND_URL}/success",
        cancel_url=f"{FRONTEND_URL}/cancel",
    )

    return {"id": session.id}


# -----------------------------
# STRIPE WEBHOOK
# -----------------------------
@app.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Webhook error")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        email = session.get("customer_details", {}).get("email")
        amount = session.get("amount_total")

        # Save order
        supabase.table("orders").insert({
            "email": email,
            "items": session.get("display_items"),
            "total_amount": amount,
            "delivery_option": "unknown",
            "stripe_session_id": session["id"],
            "payment_status": "paid"
        }).execute()

        # Update loyalty
        user = supabase.table("users").select("*").eq("email", email).execute()

        if user.data:
            current_points = user.data[0]["loyalty_points"]
            new_points = current_points + (amount // 100)

            tier = "Bronze"
            if new_points > 2000:
                tier = "Gold"
            elif new_points > 1000:
                tier = "Silver"

            supabase.table("users").update({
                "loyalty_points": new_points,
                "tier": tier
            }).eq("email", email).execute()

    return {"status": "success"}


# -----------------------------
# ADMIN ORDERS
# -----------------------------
@app.get("/admin/orders")
def get_orders():
    response = supabase.table("orders").select("*").execute()
    return response.data