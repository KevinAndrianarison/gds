import TitreLabel from "./TitreLabel";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCrown } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "@/contexte/useUser";
import { useState, useContext, useEffect } from "react";
import InputOn from "./InputOn";
import ButtonAdd from "./ButtonAdd";
import Notiflix from "notiflix";
import axios from "axios";
import { UrlContext } from "@/contexte/useUrl";
import nProgress from "nprogress";



export default function UtiliseVehicule({ vehicule, status }) {
    const [chefMissionnaire, setChefMissionnaire] = useState(null);
    const { getAlluser, users } = useContext(UserContext);
    const [lieu, setLieu] = useState('');
    const [activite, setActivite] = useState('');
    const [carburant, setCarburant] = useState('');
    const [immatriculation, setImmatriculation] = useState('');
    const [kmDepart, setKmDepart] = useState('');
    const [kmArrivee, setKmArrivee] = useState('');
    const [totalKm, setTotalKm] = useState('');
    const [qttLitre, setQttLitre] = useState('');
    const [prix, setPrix] = useState('');
    const [montant, setMontant] = useState('');
    const { url } = useContext(UrlContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getAlluser()
    }, []);

    useEffect(() => {
        if (kmArrivee && kmDepart) {
            setTotalKm(kmArrivee - kmDepart);
        }
    }, [kmArrivee, kmDepart]);

    useEffect(() => {
        if (prix && qttLitre) {
            setMontant(prix * qttLitre);
        }
    }, [prix, qttLitre]);

    const handleSubmit = () => {
        let user = JSON.parse(localStorage.getItem('user'));
        if (status === 'utiliser') {
            setChefMissionnaire(user.name);
        }
        if (!(chefMissionnaire || user.name) || !lieu || !activite || !carburant || !immatriculation || !kmDepart || !kmArrivee || !totalKm || !qttLitre || !prix || !montant) {
            Notiflix.Notify.warning("Veuillez remplir tous les champs");
        } else {
            let formData = {
                chef_missionnaire: chefMissionnaire,
                lieu: lieu,
                activite: activite,
                carburant: carburant,
                immatriculation: immatriculation,
                km_depart: kmDepart,
                km_arrivee: kmArrivee,
                total_km: totalKm,
                qtt_litre: qttLitre,
                pu_ariary: prix,
                montant: montant,
                materiel_id: vehicule.id,
                date: new Date().toISOString().split('T')[0],
            }
            setIsLoading(true);
            nProgress.start();
            axios.post(`${url}/api/vehicules`, formData)
                .then((res) => {
                    setIsLoading(false);
                    nProgress.done();
                    Notiflix.Report.success("Enregistrement réussi", "Vehicule utilisé avec succès", "OK");
                })
                .catch((err) => {
                    console.error(err);
                    setIsLoading(false);
                    nProgress.done();
                    Notiflix.Notify.failure("Erreur", "Erreur lors de l'utilisation du vehicule", "OK");
                })
        }
    }
    return (
        <div onClick={(e) => e.stopPropagation()}>
            <h1 className="font-bold flex items-center gap-2"><p className="uppercase">Utilisation de</p> <b className="text-sm text-gray-500 truncate w-80">{vehicule.type.nom} - {vehicule.caracteristiques}</b> :</h1>
            <div className="flex flex-wrap justify-between gap-2 mt-4">
                {status === 'assigner' && (
                    <div className="flex flex-col gap-1 w-52">
                        <TitreLabel titre="Chef missionnaire" />
                        <Select
                            value={chefMissionnaire}
                            onValueChange={(value) => {
                                setChefMissionnaire(value);
                            }}
                        >
                            <SelectTrigger className="focus:outline-none bg-white border-2 border-blue-200 rounded p-2 w-52 px-4">
                                <SelectValue placeholder="Chef missionnaire" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.name}>
                                        {user.role === "admin" ? (
                                            <FontAwesomeIcon
                                                className="text-yellow-500"
                                                icon={faCrown}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                className="text-blue-500"
                                                icon={faUser}
                                            />
                                        )}
                                        <p> {user.name}</p>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </div>
                )}
                <div className="flex flex-col gap-1 w-52">
                    <TitreLabel titre="lieu" />
                    <InputOn value={lieu} width="w-52" onChange={setLieu} height="h-9" />
                </div>
                <div className="flex flex-col gap-1 w-52">
                    <TitreLabel titre="activité" />
                    <InputOn value={activite} width="w-52" onChange={setActivite} height="h-9" />
                </div>
                <div className="flex flex-col gap-1 w-52">
                    <TitreLabel titre="Carburant" />
                    <InputOn value={carburant} width="w-52" onChange={setCarburant} height="h-9" />
                </div>
                <div className="flex flex-col gap-1 w-40">
                    <TitreLabel titre="Immatriculation" />
                    <InputOn value={immatriculation} width="w-40" onChange={setImmatriculation} height="h-9" />
                </div>
                <div className="flex flex-col gap-1 w-32">
                    <TitreLabel titre="T (km) départ" />
                    <InputOn value={kmDepart} width="w-32" type='number' onChange={setKmDepart} height="h-9" />
                </div>
                <div className="flex flex-col gap-1 w-32">
                    <TitreLabel titre="T (km) arrivée" />
                    <InputOn value={kmArrivee} width="w-32" type='number' onChange={setKmArrivee} height="h-9" />
                </div>
                <div className="flex flex-col gap-1 w-40">
                    <TitreLabel titre="P.U (Ariary)" />
                    <InputOn value={prix} width="w-40" type='number' onChange={setPrix} height="h-9" />
                </div>
                <div className="flex flex-col gap-1 w-32">
                    <TitreLabel titre="Total (km)" />
                    <InputOn disabled={true} value={totalKm} width="w-32" type='number' onChange={() => {}} height="h-9" />
                </div>
                <div className="flex flex-col gap-1 w-32">
                    <TitreLabel titre="Qtt (litre)" />
                    <InputOn value={qttLitre} width="w-32" type='number' onChange={setQttLitre} height="h-9" />
                </div>

                <div className="flex flex-col gap-1 w-full">
                    <TitreLabel titre="Montant (Ariary)" />
                    <InputOn disabled={true} value={montant} width="w-full" type='number' onChange={() => {}} height="h-9" />
                </div>
                <ButtonAdd label="Enregistrer" onClick={handleSubmit} isLoad={isLoading} />
            </div>
        </div>
    )
}
