import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { UrlContext } from "@/contexte/useUrl";
import { SupplyContext } from "@/contexte/useSupply";
import nProgress from "nprogress";
import Notiflix from "notiflix";
import axios from "axios";


export default function PlusSupply({ supply }) {
    const { url } = useContext(UrlContext);
    const [stockFinal, setStockFinal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { getAllSupply } = useContext(SupplyContext);

    const handlePlusSupply = () => {
        setIsLoading(true);
        nProgress.start();
        axios.put(`${url}/api/supplies/add-or-minus/${supply.id}`, { stock_final: stockFinal })
            .then((response) => {
                setIsLoading(false);
                nProgress.done();
                getAllSupply();
                Notiflix.Report.success("Succès", "Matériel mis à jour avec succès", "OK");
            })
            .catch((error) => {
                console.error(error);
                Notiflix.Notify.failure(error.response.data.message || "Matériel non ajouté");
                setIsLoading(false);
            });
    };

    return (
        <div>
            <p className="text-sm text-gray-500">Nombre de supply actuel : <b className="text-blue-500 text-lg">{supply?.stock_final}</b></p>
           <div className="flex items-center gap-2  mt-4">
           <div className="flex items-center gap-2 border-2 border-blue-300 ">
                <FontAwesomeIcon icon={faPlus} className="text-blue-500 bg-blue-300 p-2 h-full" />
                <input type="number" value={stockFinal} onChange={(e) => setStockFinal(e.target.value)} className="focus:outline-none" />
            </div>
           <div>
           {isLoading ? <FontAwesomeIcon icon={faSpinner} pulse className="text-blue-300 bg-blue-200 p-2 h-full rounded-full" /> :
           <FontAwesomeIcon icon={faArrowRight} disabled={isLoading} onClick={handlePlusSupply} className="text-blue-500 bg-blue-300 p-2 h-full rounded-full" />}
           </div>
           </div>
        </div>
    );
}