import React, { useEffect, useState } from 'react'
import { Product } from '../../types/models'

type Props = {
  categoryId: number
  searchTerm: string
  onAddToCart: (product: Product) => void
}

function ProductList({ categoryId, searchTerm, onAddToCart }: Props) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (categoryId) {
      fetch(`/api/products?categoryId=${categoryId}`)
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error('שגיאה בטעינת מוצרים:', err))
    }
  }, [categoryId])

  const filteredProducts = products.filter((product) =>
    product.name.includes(searchTerm)
  )

  return (
    <ul className="list-group">
      {filteredProducts.map((product) => (
        <li
          key={product.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div className="d-flex flex-column">
            <strong className="mb-1">{product.name}</strong>
            <span className="text-muted">₪{product.price.toFixed(2)}</span>
          </div>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onAddToCart(product)}
          >
            הוסף
          </button>
        </li>
      ))}
    </ul>
  )
}

export default ProductList
