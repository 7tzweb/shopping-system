export type Product = {
  id: number
  categoryId: number
  name: string
  price: number
}


export const mockProducts: Product[] = [
  { id: 1, name: 'חלב 3%', categoryId: 1, price: 6.5 },
  { id: 2, name: 'קוטג\' 5%', categoryId: 1, price: 5.9 },
  { id: 3, name: 'שוקולד פרה', categoryId: 2, price: 4.5 },
  { id: 4, name: 'סטייק אנטריקוט', categoryId: 2, price: 35 },
  { id: 5, name: 'מלפפון', categoryId: 3, price: 1.9 },
]
export {}