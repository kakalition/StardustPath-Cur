function TransactionTile() {
  return (
    <div className="mb-4 flex w-full flex-row">
      <div className="mr-3 rounded-xl bg-gray-200 p-2">
        <span>🏠</span>
      </div>
      <div className="flex w-full flex-col justify-between">
        <div className="flex flex-row items-center justify-between">
          <span className="text-gray-700">Oxygen</span>
          <span className="text-red-500">- Rp150.000</span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-xs text-gray-500">Utility</span>
          <span className="text-xs text-gray-500">12:58</span>
        </div>
      </div>
    </div>
  );
}

export default TransactionTile;