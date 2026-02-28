import React from "react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <div style={styles.card}>
      <img
        src={product.image}
        alt={product.name}
        style={styles.image}
      />

      <div style={styles.content}>
        <h3 style={styles.title}>{product.name}</h3>

        <p style={styles.description}>
          {product.description}
        </p>

        <div style={styles.footer}>
          <span style={styles.price}>
            ${product.price.toFixed(2)}
          </span>

          <button
            style={styles.button}
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #eee",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  image: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
  },
  content: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  title: {
    margin: "0 0 8px 0",
  },
  description: {
    fontSize: "14px",
    color: "#555",
    flexGrow: 1,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12px",
  },
  price: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  button: {
    padding: "8px 14px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ProductCard;