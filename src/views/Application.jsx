import React, { useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faExchangeAlt,
  faBookmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { UrlContext } from "../contexte/useUrl";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Empty from "@/composants/Empty";

export default function Application() {
  const [historiques, setHistoriques] = useState([]);
  const [filteredHistoriques, setFilteredHistoriques] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { url } = useContext(UrlContext);

  useEffect(() => {
    getAllHistoriques();
  }, []);

  useEffect(() => {
    setFilteredHistoriques(historiques);
  }, [historiques]);

  const getAllHistoriques = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${url}/api/historiques`);
      setHistoriques(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = () => {
    if (startDate && endDate) {
      setIsFiltered(true);
      const filtered = historiques.filter((historique) => {
        const historiqueDate = new Date(historique.date_heure);
        return historiqueDate >= startDate && historiqueDate <= endDate;
      });
      setFilteredHistoriques(filtered);
    }
  };

  const handleReset = () => {
    setIsFiltered(false);
    setStartDate(null);
    setEndDate(null);
    setFilteredHistoriques(historiques);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="w-[80vw] mx-auto my-10">
      <h1 className="text-2xl font-bold mb-4 text-center text-gr">
        Historique des activités
      </h1>

      <div className="flex justify-center gap-4 py-2">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Date de début"
          className="p-2 focus:outline-none text-gray-700 text-center cursor-pointer rounded font-bold ring"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Date de fin"
          className="p-2 focus:outline-none text-gray-700 text-center cursor-pointer rounded font-bold ring"
        />
      </div>

      <div className="flex justify-center gap-4 py-2">
        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!startDate || !endDate}
        >
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          Filtrer
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer"
        >
          <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
          Réinitialiser
        </button>
      </div>

      <div className="overflow-y-auto max-h-[60vh] mt-4">
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : filteredHistoriques.length === 0 ? (
          <div className="flex flex-col items-center gap-2 justify-center py-4">
            <Empty titre="Aucun historique pour cette période" />
          </div>
        ) : (
          filteredHistoriques.map((historique) => (
            <div
              key={historique.id}
              className=" p-4 cursor-pointer flex gap-4 items-center border"
            >
              <div className="w-20 h-20 rounded-full bg-gray-200">
                <img
                  src={
                    !historique.user?.photo_url
                      ? "https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif"
                      // : `${url}/storage/${historique.user?.photo_url}`
                      : `${url}/storage/app/public/${historique.user?.photo_url}`
                  }
                  alt="user avatar"
                  className="inline-block relative object-cover object-center !rounded-full w-full h-full m-auto shadow-md"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center flex-wrap text-xs justify-between">
                  <p
                    className={`flex items-center px-2 py-0.5 rounded-3xl gap-1 ${
                      historique.titre === "Approvisionnement"
                        ? "bg-blue-500 text-white"
                        : historique.titre === "Gestion de véhicule"
                        ? "bg-purple-500 text-white"
                        : "bg-yellow-500 text-gray-800"
                    }`}
                  >
                    <FontAwesomeIcon icon={faBookmark} /> {historique.titre}
                  </p>
                  <p className="text-blue-400">
                    {formatDate(historique.date_heure)}
                  </p>
                </div>
                <p className="mt-2 flex flex-col">
                  <span className="font-bold">{historique.user?.name}</span>{" "}
                  {historique.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
