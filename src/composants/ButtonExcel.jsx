import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
export default function ButtonExcel() {
  return (
    <button className="bg-green-400 cursor-pointer flex items-center gap-2 text-white rounded px-4 py-2">
      {" "}
      <FontAwesomeIcon icon={faFileExcel} />
      Exporter en excel
    </button>
  );
}
