import { useEffect, useState } from "react";
import API from "../api/api";

const Admin = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/admin/orders")
      .then(res => setOrders(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      {orders.map(order => (
        <div key={order.id}>
          {order.email} - $
          {(order.total_amount / 100).toFixed(2)}
        </div>
      ))}
    </div>
  );
};

export default Admin;