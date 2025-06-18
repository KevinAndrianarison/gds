import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import PlannifierContent from "../composants/PlannifierContent";

export default function Plannifier() {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const currentYear = new Date().getFullYear();
  const [visibleStartYear, setVisibleStartYear] = useState(currentYear - 3);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const yearsToShow = 7;
  const scrollLeft = () => setVisibleStartYear((prev) => prev - 1);
  const scrollRight = () => setVisibleStartYear((prev) => prev + 1);

  const visibleYears = Array.from(
    { length: yearsToShow },
    (_, i) => visibleStartYear + i
  );

  return (
    <div className="p-4 w-full mx-auto">
      {/* Mois */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {months.map((month) => (
          <div
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`text-center p-2 rounded cursor-pointer text-sm ${
              selectedMonth === month
                ? "bg-blue-500 text-white"
                : "bg-blue-100 hover:bg-blue-200"
            }`}
          >
            {month}
          </div>
        ))}
      </div>

      {/* Années avec flèches */}
      <div className="flex items-center gap-2 justify-center mb-6">
        <button
          onClick={scrollLeft}
          className="p-1 px-2.5 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div className="flex overflow-hidden gap-2">
          {visibleYears.map((year) => (
            <div
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`p-2 px-4 rounded cursor-pointer text-sm ${
                year === selectedYear
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {year}
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="p-1 px-2.5 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <div className="text-center text-lg font-medium text-gray-700">
        {selectedMonth && selectedYear ? (
          <>
            Plannification pour le mois de :{" "}
            <span className="text-blue-600">
              {selectedMonth} {selectedYear}
            </span>
          </>
        ) : (
          "Sélectionnez un mois et une année"
        )}
      </div>
      {selectedYear && selectedMonth && <PlannifierContent selectedMonth={selectedMonth} selectedYear={selectedYear} />}
    </div>
  );
}
