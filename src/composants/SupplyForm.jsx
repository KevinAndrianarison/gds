import TitreLabel from "./TitreLabel";
import InputOn from "./InputOn";
import ButtonAdd from "./ButtonAdd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function SupplyForm() {
  return (
    <div className="border-b-2 py-4 border-gray-100 flex justify-between">
      <div className="border-r w-[75%] border-gray-100 flex">
        <div className="flex flex-col gap-2">
          <TitreLabel titre="Nouveau matériel" />
          <div className="flex items-center flex-wrap gap-2">
            <InputOn width="w-80" placeholder="Ecrire ici" />
            <ButtonAdd label="AJOUTER" isLoad={false} />
          </div>
        </div>
      </div>
      <div className="border-l w-[25%] border-gray-100 px-4">
        <TitreLabel titre="Nombre de matériel" />
        <p className="text-3xl text-gray-700">
          <FontAwesomeIcon
            icon={faSpinner}
            pulse
            className="text-lg text-gray-700"
          />
        </p>
      </div>
    </div>
  );
}
