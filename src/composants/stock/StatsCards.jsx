import React from 'react';
import { Package, TrendingDown, CheckCircle } from 'lucide-react';
import TitreLabel from '@/composants/TitreLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function StatsCards({ total, inGoodCondition, inBadCondition, isLoading }) {
  return (
    <div className="grid gap-4 md:grid-cols-3 my-4">
      <div className="bg-green-100 rounded-3xl p-5 hover:bg-green-300/20 cursor-pointer transition-colors duration-200">
        <div className="flex items-center justify-between mb-2">
          <TitreLabel titre='Total Matériel' />
          <Package className="h-5 w-5 text-green-400" />
        </div>
        <p className="text-2xl font-bold text-gray-700">
          {isLoading ? <FontAwesomeIcon icon={faSpinner} pulse /> : total}
        </p>
      </div>

      <div className="bg-blue-50 rounded-3xl p-5 hover:bg-blue-300/20 cursor-pointer transition-colors duration-200">
        <div className="flex items-center justify-between mb-2">
          <TitreLabel titre='En bon état' />
          <CheckCircle className="h-5 w-5 text-blue-400" />
        </div>
        <p className="text-2xl font-bold text-gray-700">
          {isLoading ? <FontAwesomeIcon icon={faSpinner} pulse /> : inGoodCondition}
        </p>
      </div>

      <div className="bg-red-50 rounded-3xl p-5 hover:bg-red-300/20 cursor-pointer transition-colors duration-200">
        <div className="flex items-center justify-between mb-2">
          <TitreLabel titre='Mauvaise état' />
          <TrendingDown className="h-5 w-5 text-red-400" />
        </div>
        <p className="text-2xl font-bold text-gray-700">
          {isLoading ? <FontAwesomeIcon icon={faSpinner} pulse /> : inBadCondition}
        </p>
      </div>
    </div>
  );
}