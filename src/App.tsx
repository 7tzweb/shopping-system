import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './app/store'
import { addProduct } from './features/cart/cartSlice'
import CategorySelector from './features/categories/CategorySelector'
import ProductList from './features/products/ProductList'
import CartView from './features/cart/CartView'
import OrderSummary from './features/checkout/OrderSummary'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import OrdersSearch from './pages/OrdersSearch'

function ShoppingPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [isCheckoutMode, setIsCheckoutMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch()
  const cart = useSelector((state: RootState) => state.cart.items)

  const handleBackToCart = () => setIsCheckoutMode(false)

  return (
    <div className="container py-4" dir="rtl">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">🛒 רשימת קניות</h1>
        <Link to="/orders" className="btn btn-outline-primary">חיפוש הזמנות</Link>
      </div>

      {isCheckoutMode ? (
        <OrderSummary cart={cart} onBack={handleBackToCart} />
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="categorySelect" className="form-label fw-bold">בחר קטגוריה</label>
            <CategorySelector
              id="categorySelect"
              className="form-select form-select-lg"
              onChange={(e) => {
                setSelectedCategory(Number(e.target.value))
                setSearchTerm('')
              }}
            />
          </div>

          {selectedCategory && (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="שם המוצר"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <ProductList
                  categoryId={selectedCategory}
                  searchTerm={searchTerm}
                  onAddToCart={(product) =>
                    dispatch(addProduct({ ...product, quantity: 1 }))
                  }
                />
              </div>
            </>
          )}

          <CartView onCheckout={() => setIsCheckoutMode(true)} />
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShoppingPage />} />
        <Route path="/orders" element={<OrdersSearch />} />
      </Routes>
    </Router>
  )
}

export default App
