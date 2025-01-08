export default function ProductLayout({ children }) {
  return (
    <div className="products-container">
      {/* Product-specific persistent UI */}
      {children}
    </div>
  )
}