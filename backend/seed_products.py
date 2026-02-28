from database import supabase

products = [
    {
        "name": "Oud Intense",
        "collection": "Signature Collection",
        "price": 12900,
        "description": "A bold woody fragrance with deep oud and spice.",
        "image_url": "https://via.placeholder.com/300",
        "stock": 75,
        "top_notes": ["Saffron", "Bergamot"],
        "middle_notes": ["Rose", "Amber"],
        "base_notes": ["Oud", "Musk", "Patchouli"],
        "longevity": "8-10 hours",
        "projection": "Strong",
        "gender": "Unisex",
        "occasion": ["Evening", "Formal"]
    },
    {
        "name": "Aqua Fresh",
        "collection": "Fresh Series",
        "price": 8900,
        "description": "Crisp citrus with aquatic freshness.",
        "image_url": "https://via.placeholder.com/300",
        "stock": 120,
        "top_notes": ["Lemon", "Marine Accord"],
        "middle_notes": ["Lavender"],
        "base_notes": ["Vetiver", "Musk"],
        "longevity": "4-6 hours",
        "projection": "Moderate",
        "gender": "Male",
        "occasion": ["Daily", "Office"]
    },
    {
        "name": "Velvet Rose",
        "collection": "Floral Essence",
        "price": 10900,
        "description": "Romantic rose layered with soft vanilla.",
        "image_url": "https://via.placeholder.com/300",
        "stock": 90,
        "top_notes": ["Pink Pepper"],
        "middle_notes": ["Rose", "Jasmine"],
        "base_notes": ["Vanilla", "Sandalwood"],
        "longevity": "6-8 hours",
        "projection": "Moderate",
        "gender": "Female",
        "occasion": ["Date Night", "Evening"]
    },
    {
        "name": "Citrus Noir",
        "collection": "Modern Citrus",
        "price": 9900,
        "description": "Fresh citrus opening with dark woody base.",
        "image_url": "https://via.placeholder.com/300",
        "stock": 110,
        "top_notes": ["Grapefruit", "Bergamot"],
        "middle_notes": ["Black Pepper"],
        "base_notes": ["Cedarwood", "Amber"],
        "longevity": "5-7 hours",
        "projection": "Moderate",
        "gender": "Unisex",
        "occasion": ["Casual", "Daytime"]
    },
    {
        "name": "Midnight Amber",
        "collection": "Luxury Series",
        "price": 14900,
        "description": "Warm amber with rich oriental depth.",
        "image_url": "https://via.placeholder.com/300",
        "stock": 60,
        "top_notes": ["Cardamom"],
        "middle_notes": ["Amber", "Labdanum"],
        "base_notes": ["Tonka Bean", "Vanilla"],
        "longevity": "10+ hours",
        "projection": "Strong",
        "gender": "Unisex",
        "occasion": ["Formal", "Night Out"]
    }
]

response = supabase.table("products").insert(products).execute()

print("Inserted products:")
print(response.data)