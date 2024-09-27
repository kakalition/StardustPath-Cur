function BaseCard({ children, className, onContextMenu }) {
  return (
    <div className={`${className} rounded-xl border-2 border-gray-100 bg-[#fafafa]`} onContextMenu={onContextMenu}>
      {children}
    </div>
  )
}

export default BaseCard
