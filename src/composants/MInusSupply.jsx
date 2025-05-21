import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faArrowRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import nProgress from "nprogress";
import Notiflix from "notiflix";
import { UrlContext } from "@/contexte/useUrl";
import { useContext, useState } from "react";
import { SupplyContext } from "@/contexte/useSupply";

export default function MinusSupply({ supply }) {
    const { url } = useContext(UrlContext);
    const [stockFinal, setStockFinal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { getAllSupply } = useContext(SupplyContext);

    const handleMinusSupply = () => {
        setIsLoading(true);
        nProgress.start();
        axios.put(`${url}/api/supplies/add-or-minus/${supply.id}`, { stock_final: stockFinal, isMinus: true })
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
            <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-2 border-2 border-red-300 ">
                    <FontAwesomeIcon icon={faMinus} className="text-red-500 bg-red-300 p-2 h-full" />
                    <input type="number" value={stockFinal} onChange={(e) => setStockFinal(e.target.value)} className="focus:outline-none" />
                </div>
                {isLoading ? <FontAwesomeIcon icon={faSpinner} pulse className="text-red-400 bg-red-200 p-2 h-full rounded-full" /> :
                    <FontAwesomeIcon icon={faArrowRight} disabled={isLoading} onClick={handleMinusSupply} className="text-red-500 bg-red-300 p-2 h-full rounded-full" />}
            </div>
        </div>
    );
}