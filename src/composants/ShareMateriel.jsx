import { useContext, useEffect, useState } from "react";
import { RegionContext } from "@/contexte/useRegion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { UrlContext } from "@/contexte/useUrl";
import Notiflix from "notiflix";
import { MaterielContext } from "@/contexte/useMateriel";
import TitreLabel from "./TitreLabel";
import { UserContext } from "@/contexte/useUser";
import { SupplyContext } from "@/contexte/useSupply";

export default function ShareMateriel({ materiel, status, supply }) {
    const { regions, getAllRegion } = useContext(RegionContext);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const { url } = useContext(UrlContext);
    const { getAllMateriels, getMaterielParIdRegion } = useContext(MaterielContext);
    const [isLoadingPost, setIsLoadingPost] = useState(false);
    const { users, getAlluser } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const { getAllSupply, getSupplyParIdRegion } = useContext(SupplyContext);


    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            await Promise.all([getAllRegion(), getAlluser()]);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    function requestShareMateriel() {
        Notiflix.Confirm.show(
            "Confirmation",
            "Voulez-vous vraiment transférer ce matériel à cette région ?",
            "Oui",
            "Non",
            async () => {
                setIsLoadingPost(true);
                try {
                    await axios.put(`${url}/api/materiels/change-id-region/${materiel.id}/${selectedRegion}`, {
                        responsable_id: selectedUser.id
                    },
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                    const currentRegion = JSON.parse(localStorage.getItem("region"));
                    if (currentRegion) {
                        getMaterielParIdRegion(currentRegion.id);
                    } else {
                        getAllMateriels();
                    }
                    Notiflix.Notify.success("Matériel transféré avec succès");
                } catch (error) {
                    Notiflix.Notify.failure("Erreur lors du transfert du matériel");
                    console.error(error);
                } finally {
                    setIsLoadingPost(false);
                }
            }
        );
    }


    function requestShareSupply() {
        Notiflix.Confirm.show(
            "Confirmation",
            "Voulez-vous vraiment transférer ce matériel à cette région ?",
            "Oui",
            "Non",
            async () => {
                setIsLoadingPost(true);
                try {
                    await axios.put(`${url}/api/supplies/share-to-region/${selectedRegion}/${supply.id}`, {
                        receptionnaire: selectedUser.name
                    },
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                    const currentRegion = JSON.parse(localStorage.getItem("region"));
                    if (currentRegion) {
                        getSupplyParIdRegion(currentRegion.id);
                    } else {
                        getAllSupply();
                    }
                    Notiflix.Notify.success("Matériel transféré avec succès");
                } catch (error) {
                    if (error.response.status === 400) {
                        Notiflix.Notify.failure("Erreur lors du transfert du matériel");
                    }
                    console.error(error);
                } finally {
                    setIsLoadingPost(false);
                }
            }
        );
    }

    const handleShareMateriel = async () => {
        if (!selectedRegion) {
            Notiflix.Notify.warning("Veuillez sélectionner une région");
            return;
        }
        if (status === "materiel") {
            requestShareMateriel();
        }
        if (status === "supply") {
            requestShareSupply();
        }
    }

    return (
        <div>
            <h1 className="font-bold uppercase text-blue-500 text-sm">Transferer à :</h1>
            {isLoading ? (
                <div className="animate-pulse space-y-4 mt-2">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-8 bg-gray-200 rounded"></div>
                    ))}
                </div>
            ) : (
                <div className="mt-2 flex justify-between gap-2 max-h-[200px] overflow-y-auto">
                    <div className="w-1/2">
                        <TitreLabel titre="Régions" required />
                        <div className="my-2">
                            {regions.reduce((acc, region) => {
                                if (Number(region.id) !== Number(materiel?.region_id) && Number(region.id) !== Number(supply?.region_id)) {
                                    acc.push(region);
                                }
                                return acc;
                            }, []).map((region) => (
                                <div className="text-sm flex items-center gap-2" key={region.id}>
                                    <input onChange={(e) => setSelectedRegion(e.target.value)} type="radio" name="region" id={region.id} value={region.id} />
                                    <h1 className="truncate">{region.nom}</h1>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-1/2">
                        <TitreLabel titre={status === "materiel" ? "Responsables" : "Receptionnaires"} />
                        <div className="my-2">
                            {users.reduce((acc, user) => {
                                if (Number(user.id) !== Number(materiel?.responsable_id) && Number(user.id) !== Number(supply?.receptionnaire)) {
                                    acc.push(user);
                                }
                                return acc;
                            }, []).map((user) => (
                                <div className="text-sm flex items-center gap-2" key={user.id}>
                                    <input onChange={() => setSelectedUser(user)} type="radio" name="user" id={user.id} value={user} />
                                    <h1 className="truncate">{user.name}</h1>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {!isLoading && (
                <button disabled={isLoadingPost} onClick={handleShareMateriel} className="bg-blue-400  w-full text-white mt-2 px-4 py-2 inline flex items-center gap-2 rounded-3xl">
                    {isLoadingPost ? (
                        <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" pulse />
                    ) : (
                        <FontAwesomeIcon icon={faShare} className="mr-2" />
                    )}
                    Transferer</button>
            )}
        </div>
    )
}
