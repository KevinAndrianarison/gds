import TitreLabel from "./TitreLabel";
import InputOn from "./InputOn";
import ButtonAdd from "./ButtonAdd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegionContext } from "@/contexte/useRegion";
import { UserContext } from "@/contexte/useUser";
import { SupplyContext } from "@/contexte/useSupply";
import { faUser, faCrown } from "@fortawesome/free-solid-svg-icons";
import { UrlContext } from "@/contexte/useUrl";
import nProgress from "nprogress";
import axios from "axios";
import Notiflix from "notiflix";
import { ShowContext } from "@/contexte/useShow";

export default function SupplyForm() {
  const { isAdmin, isACL } = useContext(ShowContext);
  const [region, setRegion] = useState("");
  const { regions, getAllRegion } = useContext(RegionContext);
  const { users, getAlluser } = useContext(UserContext);
  const { supplies, getAllSupply, isLoadingSpin, getSupplyParIdRegion } = useContext(SupplyContext);
  const { url } = useContext(UrlContext);
  const [receptionnaire, setReceptionnaire] = useState("");
  const [nom, setNom] = useState("");
  const [stockInitial, setStockInitial] = useState("");
  const [numeroBe, setNumeroBe] = useState("");
  const [lieuDestination, setLieuDestination] = useState("");
  const [transporteur, setTransporteur] = useState("");
  const [observation, setObservation] = useState("");
  const [rubrique, setRubrique] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let region = JSON.parse(localStorage.getItem("region"));
    if (isACL) {
      setRegion(region.id);
    }
  }, []);

  function addSupply() {
    const data = {
      nom,
      region_id: region,
      stock_initial: stockInitial,
      stock_final: stockInitial,
      numero_be: numeroBe,
      lieu_destination: lieuDestination,
      transporteur,
      observation,
      date,
      rubrique,
      receptionnaire,
    };
    if (!nom || !region || !stockInitial || !receptionnaire || !rubrique || !date) {
      Notiflix.Notify.warning("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setIsLoading(true);
    nProgress.start();
    axios
      .post(`${url}/api/supplies`, data)
      .then((response) => {
        setNom("");
        setRegion("");
        setStockInitial("");
        setNumeroBe("");
        setLieuDestination("");
        setTransporteur("");
        setObservation("");
        setRubrique("");
        setDate("");
        setReceptionnaire("");
        if (isACL) {
          getSupplyParIdRegion(region);
        } else {
          getAllSupply();
        }
        Notiflix.Report.success("Succès", "Matériel ajouté avec succès", "OK");
        nProgress.done();
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        Notiflix.Report.failure(
          "Erreur",
          "Erreur lors de l'ajout du matériel",
          "OK"
        );
        nProgress.done();
        setIsLoading(false);
      });
  }

  useEffect(() => {
    async function fetchData() {
      await Promise.all([getAllRegion(), getAlluser()]);
    }
    fetchData();
  }, []);

  return (
    <div className="border-b-2 py-4 border-gray-100 flex justify-between flex-wrap max-sm:flex-col max-sm:gap-4">
      <div className="border-r w-[80%] flex flex-wrap gap-4 border-gray-100 max-sm:w-full max-sm:border-none flex px-2">
        <div className="flex flex-col gap-2 w-40">
          <TitreLabel titre="Nouveau matériel" required />
          <div className="flex items-center flex-wrap gap-2">
            <InputOn
              value={nom}
              onChange={setNom}
              width="w-40"
              placeholder="Ecrire ici"
            />
          </div>
        </div>
        {isAdmin && (
          <div className="flex flex-col gap-2 w-40 max-sm:w-full">
            <TitreLabel titre="Région" required />
            <div className="flex items-center flex-wrap gap-2">
              <Select
                value={region}
                onValueChange={(value) => {
                  setRegion(value);
                }}
              >
                <SelectTrigger className="focus:outline-none bg-white border-2 border-blue-200 rounded p-2 w-40  px-4">
                  <SelectValue placeholder="Région" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 w-40">
          <TitreLabel titre="Stock initial" required />
          <div className="flex items-center flex-wrap gap-2">
            <InputOn
              value={stockInitial}
              onChange={setStockInitial}
              width="w-40"
              type="number"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-40">
          <TitreLabel titre="Rubrique" required />
          <div className="flex items-center flex-wrap gap-2">
            <InputOn value={rubrique} onChange={setRubrique} width="w-40" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-40">
          <TitreLabel titre="Numéros B.E" />
          <div className="flex items-center flex-wrap gap-2">
            <InputOn value={numeroBe} onChange={setNumeroBe} width="w-40" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-40">
          <TitreLabel titre="Lieu de destination" />
          <div className="flex items-center flex-wrap gap-2">
            <InputOn
              value={lieuDestination}
              onChange={setLieuDestination}
              width="w-40"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-40">
          <TitreLabel titre="Transporteur" />
          <div className="flex items-center flex-wrap gap-2">
            <InputOn
              value={transporteur}
              onChange={setTransporteur}
              width="w-40"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-40">
          <TitreLabel titre="Observation" />
          <div className="flex items-center flex-wrap gap-2">
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="border-2 border-blue-200 focus:outline-none rounded p-2 h-10 min-h-10"
            ></textarea>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-40">
          <TitreLabel titre="Date" required />
          <div className="flex items-center flex-wrap gap-2">
            <InputOn value={date} onChange={setDate} width="w-40" type="date" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-40">
          <TitreLabel titre="Réceptionnaire" required />
          <div className="flex items-center flex-wrap gap-2">
            <Select
              value={receptionnaire}
              onValueChange={(value) => {
                setReceptionnaire(value);
              }}
            >
              <SelectTrigger className="focus:outline-none bg-white border-2 border-blue-200 rounded p-2 w-40 px-4">
                <SelectValue placeholder="Receptionnaire" />
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
        </div>
        <div className="flex items-end">
          <ButtonAdd
            height="h-10"
            onClick={addSupply}
            label="AJOUTER"
            isLoad={isLoading}
          />
        </div>
      </div>
      <div className="border-l w-[20%] border-gray-100 max-sm:w-full px-4">
        <TitreLabel titre="Nombre de matériel" />
        <p className="text-3xl text-gray-700">
          {isLoadingSpin ? (
            <FontAwesomeIcon
              icon={faSpinner}
              pulse
              className="text-lg text-gray-700"
            />
          ) : (
            supplies.length
          )}
        </p>
      </div>
    </div>
  );
}
