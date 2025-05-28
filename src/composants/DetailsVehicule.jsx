import { useNavigate, useParams  } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { MaterielContextProvider, useMateriel } from "@/contexte/useMateriel";
import { useContext, useEffect } from "react";



function DetailsVehiculeContent() {
  const navigate = useNavigate();
  const { oneVehicule, getOneUtilisation, isLoadingUtilisation } = useMateriel();
  const { id } = useParams();

  useEffect(()=>{
    getOneUtilisation(id)
  },[id])

  return (
    <div className="w-[80vw] mx-auto my-10">
      <button
        className=" border-2 cursor-pointer border-blue-500  flex items-center gap-2 text-blue-500 font-bold px-4 py-2 rounded-3xl"
        onClick={() => navigate('/gestion-de-vehicule')}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Retour
      </button>
<div className="text-2xl flex gap-2 items-center font-bold text-gray-700 my-4">
  <p>Detail sur l'utilisation de :</p>
  {isLoadingUtilisation ? (
    <div className="h-6 bg-gray-200 w-20 rounded animate-pulse"></div>
    ) : (
        <p className="uppercase text-gray-400">
        {oneVehicule?.type?.nom}
        </p>
        )}
    </div>
    </div>
  );
}

export default function DetailsVehicule() {
  return (
    <MaterielContextProvider>
      <DetailsVehiculeContent />
    </MaterielContextProvider>
  );
}
