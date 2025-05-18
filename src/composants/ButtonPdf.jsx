import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faSpinner } from "@fortawesome/free-solid-svg-icons";
export default function ButtonPdf({onClick, isLoading}) {
  return (
    <button disabled={isLoading} onClick={onClick} className="bg-red-400 cursor-pointer flex items-center gap-2 text-white rounded px-4 py-2">
      {isLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faFilePdf} />}
      Exporter en pdf
    </button>
  );
}
