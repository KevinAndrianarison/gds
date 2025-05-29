import React, { useContext, useState } from "react";
import TitreLabel from "./TitreLabel";
import InputOn from "./InputOn";
import ButtonAdd from "./ButtonAdd";
import { RegionContext } from "@/contexte/useRegion";
import { UrlContext } from "@/contexte/useUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Notiflix from "notiflix";
import nProgress from "nprogress";
import { apiRequest } from "@/api";

export default function FormRegion() {
  const { regions, isLoading, getAllRegion } = useContext(RegionContext);
  const urlContext = useContext(UrlContext);
  const [regionName, setRegionName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!regionName.trim()) {
      Notiflix.Report.failure(
        "Erreur",
        "Veuillez saisir un nom de région",
        "OK"
      );
      return;
    }

    setIsSubmitting(true);
    nProgress.start();
    try {
      await apiRequest(urlContext, "post", "/api/regions", { nom: regionName });
      Notiflix.Report.success("Succès", "Région ajoutée avec succès", "OK");
      setRegionName("");
      getAllRegion(); // Mettre à jour la liste des régions
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Notiflix.Report.failure(
          "Erreur",
          "Une région avec ce nom existe déjà",
          "OK"
        );
      } else {
        Notiflix.Report.failure(
          "Erreur",
          "Erreur lors de l'ajout de la région",
          "OK"
        );
      }
    } finally {
      setIsSubmitting(false);
      nProgress.done();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-b-2 py-4 border-gray-100 flex justify-between flex-wrap max-sm:flex-col max-sm:gap-4"
    >
      <div className="border-r w-[75%] border-gray-100 flex max-sm:border-none">
        <div className="flex flex-col gap-2">
          <TitreLabel titre="Région" />
          <div className="flex items-center flex-wrap gap-2">
            <InputOn
              width="w-80"
              placeholder="Ecrire ici"
              value={regionName}
              onChange={setRegionName}
            />
            <ButtonAdd type="submit" label="AJOUTER" isLoad={isSubmitting} />
          </div>
        </div>
      </div>
      <div className="border-l w-[25%] max-sm:w-full border-gray-100 px-4">
        <TitreLabel titre="Nombre de région" />
        {isLoading ? (
          <FontAwesomeIcon
            icon={faSpinner}
            pulse
            className="text-lg text-gray-700"
          />
        ) : (
          <p className="text-3xl text-gray-700">{regions.length}</p>
        )}
      </div>
    </form>
  );
}
