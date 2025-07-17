import React, { useState } from 'react'
import { CartItem } from '../cart/cartSlice'

interface OrderSummaryProps {
  cart: CartItem[]
  onBack: () => void
}

function OrderSummary({ cart, onBack }: OrderSummaryProps) {
  const [formData, setFormData] = useState({
    fullName: 'test',
    address: 'test',
    email: 'test@gmail.com',
  })

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false) // ✅ מניע כפילות

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return // ✅ הגנה בפני שליחה כפולה

    if (!formData.fullName || !formData.address || !formData.email) {
      setError('אנא מלא את כל השדות החובה')
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          address: formData.address,
          email: formData.email,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'שגיאה בשליחת ההזמנה')
      }

      setSubmitted(true)
      setError(null)
    } catch (err: any) {
      console.error('Order error:', err)
      setError(err.message || 'שגיאה כללית')
    } finally {
      setIsSubmitting(false) // ✅ מאפשר שליחה חדשה בעתיד
    }
  }

  const handleNewOrder = () => {
    setFormData({ fullName: '', address: '', email: '' })
    setSubmitted(false)
    setError(null)
    onBack()
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  if (submitted) {
    return (
      <div className="warp-finsh-page">
        <div className="alert alert-success text-center mt-4">
          תודה! ההזמנה נשלחה בהצלחה ✅
        </div>
        <div className="text-center mt-3">
          <button className="btn btn-outline-primary" onClick={handleNewOrder}>
            בצע הזמנה נוספת
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <button onClick={onBack} className="btn btn-secondary mb-3">
        חזרה לסל
      </button>

      <h2 className="mb-4">📦 סיכום הזמנה</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">שם מלא</label>
          <input
            type="text"
            name="fullName"
            className="form-control"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">כתובת מלאה</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">אימייל</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <h5 className="mt-4">🛍️ מוצרים שנבחרו:</h5>
        <ul className="list-group mb-4">
          {cart.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between"
            >
              <span>{item.name}</span>
              <span>
                {item.quantity} × {item.price.toFixed(2)} ₪
              </span>
            </li>
          ))}
        </ul>

        <div className="text-end fw-bold mb-3">
          סה״כ לתשלום: {total.toFixed(2)} ₪
        </div>

        <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
          {isSubmitting ? 'שולח...' : 'אשר הזמנה'}
        </button>
      </form>
    </div>
  )
}

export default OrderSummary
