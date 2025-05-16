import React from 'react'
import { Package, TrendingDown, CheckCircle } from 'lucide-react'
import TitreLabel from '@/composants/TitreLabel'

export default function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3 my-4">
      <div className="bg-blue-50 rounded-3xl p-5 hover:bg-blue-300/20 transition-colors duration-200">
        <div className="flex items-center justify-between mb-2">
          <TitreLabel titre='Total Matériels' />
          <Package className="h-5 w-5 text-blue-400" />
        </div>
        <p className="text-2xl font-bold text-gray-700">150</p>
      </div>

      <div className="bg-blue-50 rounded-3xl p-5 hover:bg-blue-300/20 transition-colors duration-200">
        <div className="flex items-center justify-between mb-2">
          <TitreLabel titre='En bon état' />
          <CheckCircle className="h-5 w-5 text-blue-400" />
        </div>
        <p className="text-2xl font-bold text-gray-700">120</p>
      </div>

      <div className="bg-blue-50 rounded-3xl p-5 hover:bg-blue-300/20 transition-colors duration-200">
        <div className="flex items-center justify-between mb-2">
          <TitreLabel titre='Mauvaise état' />
          <TrendingDown className="h-5 w-5 text-blue-400" />
        </div>
        <p className="text-2xl font-bold text-gray-700">80%</p>
      </div>
    </div>
  )
}
