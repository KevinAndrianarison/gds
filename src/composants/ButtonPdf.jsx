import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
export default function ButtonPdf() {
  return (
    <button className="bg-red-400 cursor-pointer flex items-center gap-2 text-white rounded px-4 py-2">
      <FontAwesomeIcon icon={faFilePdf} />
      Exporter en pdf
    </button>
  );
}
