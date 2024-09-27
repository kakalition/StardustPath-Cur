function DateFilterChip({ value, isActive, onClick }) {
  return (
    <div className={`cursor-pointer rounded-full transition ${isActive ? 'bg-blue-100' : ''}`} onClick={onClick}>
      <span className="px-3 font-semibold text-gray-600">{value}</span>
    </div>
  );
}

export default DateFilterChip;