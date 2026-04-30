# Youthentic Fragrance Platform 🌿

A full-stack e-commerce prototype for **Youthentic**, a fragrance brand focused on personalization, discovery, and direct-to-consumer experiences.

This project demonstrates a modern web architecture using **React (frontend)**, **Python backend**, **Supabase database**, and **Stripe payments**, deployed using **Netlify + Render**.

---

## Features

### Customer-Facing
- Homepage with brand positioning and story
- Product listing page (fragrances)
- Scent quiz for personalized recommendations
- Shopping cart (non-persistent prototype)
- Checkout flow:
  - Self-collection option
  - Home delivery (+ additional cost)
- Loyalty program (tier-based rewards)
- Brand story / About page

---

### Admin Dashboard
- View all orders
- Filter by status (paid, pending, cancelled)
- Search by email / order ID
- Update order status
- KPI metrics:
  - Total orders
  - Paid orders
  - Revenue
  - Average order value

---

### Payments
- Integrated with Stripe Checkout
- Handles:
  - Payment success
  - Payment cancellation
- Stores Stripe session IDs for tracking

---

## Tech Stack

### Frontend
- React (JavaScript)
- React Router
- Context API (Cart management)
- Hosted on Netlify

### Backend
- Python (FastAPI / Flask)
- REST API architecture
- Hosted on Render

### Database
- Supabase (PostgreSQL)

### Payments
- Stripe API


## Installation & Setup

### Clone the repository

```bash
git clone https://github.com/bulbasaurabh/youthentic.git
cd youthentic
```
### Start the Frontend

```bash
cd frontend
npm install
npm start
```

### Start the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 10000
```

## Known Limitations
- No authentication system implemented
- Backend may experience cold starts on Render free tier
- Limited error handling for production use

## Future Improvements
- User authentication (login/signup)
- Recommendation engine (AI-based scent matching)
- Inventory management
- Email notifications (order confirmation)


## Project Goal

This project was built to:

- Demonstrate direct-to-consumer strategy (avoiding marketplaces like Shopee/TikTok Shop)
- Explore customer experience improvements in fragrance e-commerce
- Prototype a scalable architecture for brand expansion

## License

This project is for educational and prototype purposes only.
