import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

type OrderItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  fullName: string;
  address: string;
  email: string;
  createdAt: string;
  items: OrderItem[];
};

const OrdersSearch = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data);
      });
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.fullName.toLowerCase().includes(lowerSearch) ||
        order.email.toLowerCase().includes(lowerSearch) ||
        order.address.toLowerCase().includes(lowerSearch)
    );
    setFilteredOrders(filtered);
  }, [search, orders]);

  return (
    <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">חיפוש הזמנות</h2>
            <Link to="/" className="btn btn-secondary">⬅ חזור לרשימת הקניות</Link>
        </div>
      <h2 className="mb-3">חיפוש הזמנות</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="חפש לפי שם, מייל או כתובת"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredOrders.length === 0 ? (
        <p>לא נמצאו הזמנות</p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.id} className="card mb-3 p-3 shadow-sm">
            <h5>{order.fullName}</h5>
            <p>
              <strong>כתובת:</strong> {order.address}<br />
              <strong>מייל:</strong> {order.email}<br />
              <strong>תאריך:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity} – ₪{item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersSearch;
