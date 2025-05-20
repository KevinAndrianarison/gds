import React, { useState } from "react";
import { Package, TrendingDown, CheckCircle } from "lucide-react";
import TitreLabel from "@/composants/TitreLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import RecapStock from "../RecapStock";

export default function StatsCards({
  total,
  inGoodCondition,
  inBadCondition,
  isLoading,
  materielsGroupes,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("total");
  return (
    <div className="grid gap-4 md:grid-cols-3 my-4">
      <div
        onClick={() => {
          if (isLoading || materielsGroupes.length === 0) return;
          setStatus("total");
          setIsOpen(true);
        }}
        className="bg-green-100 rounded-3xl p-5 hover:bg-green-300/20 cursor-pointer transition-colors duration-200"
      >
        <div className="flex items-center justify-between mb-2">
          <TitreLabel titre="Total Matériel" />
          <Package className="h-5 w-5 text-green-400" />
        </div>
        <p className="text-2xl font-bold text-gray-700">
          {isLoading ? <FontAwesomeIcon icon={faSpinner} pulse /> : total}
        </p>
      </div>

      <div
        onClick={() => {
          if (isLoading || materielsGroupes.length === 0) return;
          setStatus("goodCondition");
          setIsOpen(true);
        }}
        className="bg-blue-50 rounded-3xl p-5 hover:bg-blue-300/20 cursor-pointer transition-colors duration-200"
      >
        <div className="flex items-center justify-between mb-2">
          <TitreLabel titre="En bon état" />
          <CheckCircle className="h-5 w-5 text-blue-400" />
        </div>
        <p className="text-2xl font-bold text-gray-700">
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} pulse />
          ) : (
            inGoodCondition
          )}
        </p>
      </div>

      <div
        onClick={() => {
          if (isLoading || materielsGroupes.length === 0) return;
          setStatus("badCondition");
          setIsOpen(true);
        }}
        className="bg-red-50 rounded-3xl p-5 hover:bg-red-300/20 cursor-pointer transition-colors duration-200"
      >
        <div className="flex items-center justify-between mb-2">
          <TitreLabel titre="Mauvaise état" />
          <TrendingDown className="h-5 w-5 text-red-400" />
        </div>
        <p className="text-2xl font-bold text-gray-700">
          {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} pulse />
          ) : (
            inBadCondition
          )}
        </p>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-sm w-[500px] p-2"
          >
            <div className="flex justify-end">
              <FontAwesomeIcon
                icon={faXmark}
                className="text-gray-700 cursor-pointer"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <RecapStock
              materielsGroupes={materielsGroupes}
              total={total}
              inGoodCondition={inGoodCondition}
              inBadCondition={inBadCondition}
              status={status}
              setStatus={setStatus}
            />
          </div>
        </div>
      )}
    </div>
  );
}
