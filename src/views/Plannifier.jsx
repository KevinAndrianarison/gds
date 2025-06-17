import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faCrown,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import TitreLabel from "../composants/TitreLabel";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserContext } from "@/contexte/useUser";
import { useContext, useEffect } from "react";
import InputOn from "../composants/InputOn";
import ButtonAdd from "../composants/ButtonAdd";

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
  const [chefMissionnaire, setChefMissionnaire] = useState(null);
  const [lieu, setLieu] = useState("");
  const [activite, setActivite] = useState("");
  const [carburant, setCarburant] = useState("");
  const [immatriculation, setImmatriculation] = useState("");
  const [kmDepart, setKmDepart] = useState("");
  const [kmArrivee, setKmArrivee] = useState("");
  const [totalKm, setTotalKm] = useState("");
  const [qttLitre, setQttLitre] = useState("");
  const [prix, setPrix] = useState("");
  const [montant, setMontant] = useState("");
  const { getAlluser, users } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAlluser()
}, []);

  const yearsToShow = 7;
  const scrollLeft = () => setVisibleStartYear((prev) => prev - 1);
  const scrollRight = () => setVisibleStartYear((prev) => prev + 1);

  const visibleYears = Array.from(
    { length: yearsToShow },
    (_, i) => visibleStartYear + i
  );

  return (
    <div className="p-4 w-full max-w-4xl mx-auto">
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

      {/* Affichage du mois et de l'année sélectionnés */}
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
      <div className=" mt-4 flex min-h-[400px]">
        <div className="w-[75%] border-r-4 border-blue-500 p-2">
          <h1 className="text-sm font-bold uppercase">Planing :</h1>
          <div className="flex flex-wrap justify-between gap-2 mt-4">
            <div className="flex flex-col gap-1 w-52">
              <TitreLabel titre="Chef missionnaire" />
              <Select
                value={chefMissionnaire}
                onValueChange={(value) => {
                  setChefMissionnaire(value);
                }}
              >
                <SelectTrigger className="focus:outline-none bg-white border-2 border-blue-200 rounded p-2 w-52 px-4">
                  <SelectValue placeholder="Chef missionnaire" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.role === "admin" ? (
                        <FontAwesomeIcon
                          className="text-yellow-500"
                          icon={faCrown}
                        />
                      ) : (
                        <FontAwesomeIcon
                          className="text-blue-500"
                          icon={faUser}
                        />
                      )}
                      <p> {user.name}</p>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1 w-52">
              <TitreLabel titre="lieu" />
              <InputOn
                value={lieu}
                width="w-52"
                onChange={setLieu}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-52">
              <TitreLabel titre="activité" />
              <InputOn
                value={activite}
                width="w-52"
                onChange={setActivite}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-52">
              <TitreLabel titre="Carburant" />
              <InputOn
                value={carburant}
                width="w-52"
                onChange={setCarburant}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-40">
              <TitreLabel titre="Immatriculation" />
              <InputOn
                value={immatriculation}
                width="w-40"
                onChange={setImmatriculation}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <TitreLabel titre="T (km) départ" />
              <InputOn
                value={kmDepart}
                width="w-32"
                type="number"
                onChange={setKmDepart}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <TitreLabel titre="T (km) arrivée" />
              <InputOn
                value={kmArrivee}
                width="w-32"
                type="number"
                onChange={setKmArrivee}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-40">
              <TitreLabel titre="P.U (Ariary)" />
              <InputOn
                value={prix}
                width="w-40"
                type="number"
                onChange={setPrix}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <TitreLabel titre="Total (km)" />
              <InputOn
                disabled={true}
                value={totalKm}
                width="w-32"
                type="number"
                onChange={() => {}}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <TitreLabel titre="Qtt (litre)" />
              <InputOn
                value={qttLitre}
                width="w-32"
                type="number"
                onChange={setQttLitre}
                height="h-9"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <TitreLabel titre="Montant (Ariary)" />
              <InputOn
                disabled={true}
                value={montant}
                width="w-full"
                type="number"
                onChange={() => {}}
                height="h-9"
              />
            </div>
            <ButtonAdd
              label="Enregistrer"
              isLoad={isLoading}
            />
          </div>
        </div>
        <div className="w-[25%] border-l-4 border-blue-500 p-2">
          <h1 className="text-sm font-bold uppercase">Activités :</h1>
        </div>
      </div>
    </div>
  );
}
