import React from 'react'
import { Filter } from 'lucide-react'

export default function FilterButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <Filter className="h-4 w-4 text-gray-500" />
    </button>
  )
}
