import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarOn, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function OnePlanning({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div key={item.id} className="p-2 border-gray-200">
      <div className="font-bold flex items-center justify-between" onClick={toggleOpen}>
        <div className="flex items-center">
          <FontAwesomeIcon
            icon={faCarOn}
            className="mr-2 text-blue-500 border-2 border-blue-500 p-2 rounded-full"
          />
          {item.date}
        </div>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </div>
      {isOpen && (
        <ul className="mt-2">
          <li>
            <b>Chef missionnaire :</b> {item.chef_missionnaire}
          </li>
          <li>
            <b>Lieu :</b> {item.lieu}
          </li>
          <li>
            <b>Activité :</b> {item.activite}
          </li>
          <li>
            <b>Carburant :</b> {item.carburant}
          </li>
          <li>
            <b>Immatriculation :</b> {item.immatriculation}
          </li>
          <li>
            <b>Km départ :</b> {item.km_depart}
          </li>
          <li>
            <b>Km arrivée :</b> {item.km_arrivee}
          </li>
          <li>
            <b>Total (km) :</b> {item.total_km}
          </li>
          <li>
            <b>Qtt (litre) :</b> {item.qtt_litre}
          </li>
          <li>
            <b>P.U (Ariary) :</b> {item.pu_ariary}
          </li>
          <li>
            <b>Montant (Ariary) :</b> {item.montant}
          </li>
        </ul>
      )}
    </div>
  );
}
