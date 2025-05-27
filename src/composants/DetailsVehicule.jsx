import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { MaterielContext } from "@/contexte/useMateriel";
import { useContext } from "react";

export default function DetailsVehicule() {
  const navigate = useNavigate();
  const { oneVehicule } = useContext(MaterielContext);


  return (
    <div className="w-[80vw] mx-auto">
      <button
        className=" border-2 cursor-pointer border-blue-500  flex items-center gap-2 text-blue-500 font-bold px-4 py-2 rounded-3xl"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Retour
      </button>
      <h1 className="text-2xl font-bold">
        Detail sur l'utilisation de : {oneVehicule.type.nom}
      </h1>
    </div>
  );
}
