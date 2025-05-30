import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faArrowRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import nProgress from "nprogress";
import Notiflix from "notiflix";
import { UrlContext } from "@/contexte/useUrl";
import { useContext, useState } from "react";
import { SupplyContext } from "@/contexte/useSupply";
import InputOn from "./InputOn";


export default function MinusSupply({ supply }) {
  const { url } = useContext(UrlContext);
  const [stockFinal, setStockFinal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { getAllSupply, getSupplyParIdRegion } = useContext(SupplyContext);
  const [observation, setObservation] = useState("");
  const [rubrique, setRubrique] = useState("");
  const [lieuDestination, setLieuDestination] = useState("");
  const [transporteur, setTransporteur] = useState("");
  const [receptionnaire, setReceptionnaire] = useState("");
  const [numeroBe, setNumeroBe] = useState("");
  const [date, setDate] = useState("");

  const handleMinusSupply = () => {
    let token = localStorage.getItem('token');
    if (stockFinal <= 0 || rubrique === "" || date === "") {
      Notiflix.Notify.warning("Le nombre de matériel à retirer ne peut pas être négatif ou égal à 0 et la rubrique et la date sont obligatoires");
      return;
    }
    setIsLoading(true);
    nProgress.start();
    axios
      .post(`${url}/api/details-supplies`, {
        supply_id: supply.id,
        entree: null,
        sortie: stockFinal,
        rubrique: rubrique,
        lieu_destination: lieuDestination,
        transporteur: transporteur,
        receptionnaire: receptionnaire,
        observation: observation,
        numero_be: numeroBe,
        date: date,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        setIsLoading(false);
        nProgress.done();
        let region = JSON.parse(localStorage.getItem("region"));
        if (region) {
          getSupplyParIdRegion(region.id);
        } else {
          getAllSupply();
        }
        Notiflix.Report.success(
          "Succès",
          "Matériel mis à jour avec succès",
          "OK"
        );
      })
      .catch((error) => {
        console.error(error);
        Notiflix.Notify.failure(
          error.response.data.message || "Matériel non mis à jour"
        );
        setIsLoading(false);
      });
  };

  return (
    <div>
      <p className="text-sm text-gray-500">
        Nombre de <b>{supply?.nom}</b> actuel :{" "}
        <b className="text-blue-500 text-lg">{supply?.stock_final || 0}</b>
      </p>
      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto my-2">
        <div className="flex items-center gap-2 rounded border-2 border-yellow-200 ">
          <FontAwesomeIcon
            icon={faMinus}
            className="text-yellow-500 bg-yellow-300 p-2 h-full"
          />
          <input
            type="number"
            value={stockFinal}
            onChange={(e) => setStockFinal(e.target.value)}
            className="focus:outline-none w-full"
          />
        </div>
        <InputOn placeholder="Rubrique" value={rubrique} onChange={setRubrique} width="w-full" />
        <InputOn placeholder="Date" value={date} type="date" onChange={setDate} width="w-full" />
        <InputOn placeholder="Lieu de destination" value={lieuDestination} onChange={setLieuDestination} width="w-full" />
        <InputOn placeholder="Transporteur" value={transporteur} onChange={setTransporteur} width="w-full" />
        <InputOn placeholder="Receptionnaire" value={receptionnaire} onChange={setReceptionnaire} width="w-full" />
        <InputOn placeholder="Observation" value={observation} onChange={setObservation} width="w-full" />
        <InputOn placeholder="Numéro de BE" value={numeroBe} type="number" onChange={setNumeroBe} width="w-full" />

      </div>
      <button onClick={handleMinusSupply} disabled={isLoading} className="text-yellow-600 font-bold bg-yellow-200 p-2 h-full cursor-pointer w-full mt-2 rounded-full">
        {isLoading ? (
          <p>
            {" "}
            Chargement
            <FontAwesomeIcon icon={faSpinner} pulse className="ml-2" />{" "}
          </p>
        ) : (
          <p >
            Enregistrer
            <FontAwesomeIcon
              icon={faArrowRight}
              className="ml-2"
            />{" "}
          </p>
        )}
      </button>
    </div>
  );
}
