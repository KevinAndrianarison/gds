import React, { useEffect, useContext } from "react";
import Entete from "@/composants/Entete";
import { MaterielContextProvider, useMateriel } from "@/contexte/useMateriel";

function GestionDeVehiculeContent() {
  const { getAllVehicules, getVehiculesParIdRegion } = useMateriel();

  useEffect(() => {
    let region = JSON.parse(localStorage.getItem("region"));
    if (region) {
      getVehiculesParIdRegion(region.id);
    } else {
      getAllVehicules();
    }
  }, []);

  return (
    <div className="w-[80vw] mx-auto">
      <Entete titre="des véhicules" description="gérer vos véhicules" />
    </div>
  );
}

export default function GestionDeVehicule() {
  return (
    <MaterielContextProvider>
      <GestionDeVehiculeContent />
    </MaterielContextProvider>
  );
}
