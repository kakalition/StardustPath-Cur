import { ArrowRightIcon } from "@heroicons/react/24/outline"

function CategoryTile({ name, icon, onClick, isActive }) {
  return (
    <div className={`flex cursor-pointer flex-row rounded-lg p-2 transition hover:bg-gray-200 ${isActive ? "bg-gray-200" : ""}`} onClick={onClick}>
      <div className="mr-2">
        {icon ?? <ArrowRightIcon className="size-6 stroke-gray-600 stroke-2" />}
      </div>
      <p className="font-medium text-gray-700">{name}</p>
    </div>
  )
}

export default CategoryTile
