import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import { updateQuantity, removeProduct } from './cartSlice'

type CartViewProps = {
  onCheckout: () => void
}

const CartView: React.FC<CartViewProps> = ({ onCheckout }) => {
  const dispatch = useDispatch()
  const cart = useSelector((state: RootState) => state.cart.items)

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cart.length === 0)
    return <p className="mt-4 text-muted">העגלה ריקה 🛒</p>

  return (
    <div className="mt-5">
      <h3 className="mb-3">סל קניות</h3>
      <ul className="list-group">
        {cart.map((item) => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{item.name}</strong>
              <div style={{ fontSize: '0.85em', color: '#555' }}>
                ₪{item.price} ליח׳ | סה"כ ₪{item.price * item.quantity}
              </div>
            </div>
            <div className="btn-group">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() =>
                  dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                }
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => dispatch(removeProduct(item.id))}
              >
                ❌
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() =>
                  dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                }
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-3 text-end">
        <strong>סה״כ לתשלום: ₪{total.toFixed(2)}</strong>
      </div>

      <div className="d-grid mt-4">
        <button className="btn btn-success" onClick={onCheckout}>
          המשך לסיכום הזמנה
        </button>
      </div>
    </div>
  )
}

export default CartView
