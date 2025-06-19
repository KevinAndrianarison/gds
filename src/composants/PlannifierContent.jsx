import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "@/contexte/useUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faUser,
  faChevronDown,
  faChevronUp,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import TitreLabel from "./TitreLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InputOn from "./InputOn";
import ButtonAdd from "./ButtonAdd";
import { useParams } from "react-router-dom";
import nProgress from "nprogress";
import Notiflix from "notiflix";
import axios from "axios";
import { UrlContext } from "@/contexte/useUrl";
import { MaterielContextProvider, useMateriel } from "@/contexte/useMateriel";
import OnePlanning from "./OnePlanning";

function PlannifierComp({ selectedMonth, selectedYear }) {
  const [chefMissionnaire, setChefMissionnaire] = useState(null);
  const [lieu, setLieu] = useState("");
  const [activite, setActivite] = useState("");
  const [carburant, setCarburant] = useState("");
  const [immatriculation, setImmatriculation] = useState("");
  const [kmDepart, setKmDepart] = useState("");
  const [kmArrivee, setKmArrivee] = useState("");
  const [totalKm, setTotalKm] = useState("");
  const [qttLitre, setQttLitre] = useState("");
  const [prix, setPrix] = useState("");
  const [montant, setMontant] = useState("");
  const { getAlluser, users } = useContext(UserContext);
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const { url } = useContext(UrlContext);
  const [isOpen, setIsOpen] = useState(true);
  const {
    getPlanningByIdVehicule,
    onePlanning,
    setOnePlanning,
    setOneVehicule,
    oneVehicule,
    getOneUtilisation,
    isLoadingUtilisation,
    isLoadingPlanning,
  } = useMateriel();

  useEffect(() => {
    getAlluser();
  }, []);

  useEffect(() => {
    Promise.all([getPlanningByIdVehicule(id), getOneUtilisation(id)]);
  }, [id]);

  const getMonthAndYearFromDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return { month, year };
  };

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

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

  function handleSubmit() {
    if (
      !chefMissionnaire ||
      !lieu ||
      !activite ||
      !carburant ||
      !immatriculation ||
      !kmDepart ||
      !kmArrivee ||
      !totalKm ||
      !qttLitre ||
      !prix ||
      !montant
    ) {
      Notiflix.Notify.warning("Veuillez remplir tous les champs");
    }
    let token = localStorage.getItem("token");
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
      materiel_id: id,
      date: date,
      isplannification: true,
    };
    setIsLoading(true);
    nProgress.start();
    axios
      .post(`${url}/api/vehicules`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setChefMissionnaire("");
        setLieu("");
        setActivite("");
        setCarburant("");
        setImmatriculation("");
        setKmDepart("");
        setKmArrivee("");
        setTotalKm("");
        setQttLitre("");
        setPrix("");
        setMontant("");
        setDate("");
        nProgress.done();
        getPlanningByIdVehicule(id);
        Notiflix.Report.success(
          "Enregistrement réussi",
          "Planification effectuée avec succès",
          "OK"
        );
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        nProgress.done();
        Notiflix.Notify.failure("Erreur", "Erreur lors d'enregistrement", "OK");
      });
  }

  return (
    <div className="mt-4 flex min-h-[400px]">
      <div className="w-[65%] border-r-4 border-blue-500 p-2 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-bold uppercase">Planing :</h1>
          <button onClick={toggleSection} className="focus:outline-none">
            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
          </button>
        </div>
        {isOpen && (
          <div className="flex flex-wrap justify-between gap-2 mt-4">
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
            <div className="flex flex-col gap-1 w-32">
              <TitreLabel titre="Date" />
              <InputOn
                value={date}
                width="w-32"
                type="date"
                onChange={setDate}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-52">
              <TitreLabel titre="lieu" />
              <InputOn
                value={lieu}
                width="w-52"
                onChange={setLieu}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-52">
              <TitreLabel titre="activité" />
              <InputOn
                value={activite}
                width="w-52"
                onChange={setActivite}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-52">
              <TitreLabel titre="Carburant" />
              <InputOn
                value={carburant}
                width="w-52"
                onChange={setCarburant}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-40">
              <TitreLabel titre="Immatriculation" />
              <InputOn
                value={immatriculation}
                width="w-40"
                onChange={setImmatriculation}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <TitreLabel titre="T (km) départ" />
              <InputOn
                value={kmDepart}
                width="w-32"
                type="number"
                onChange={setKmDepart}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <TitreLabel titre="T (km) arrivée" />
              <InputOn
                value={kmArrivee}
                width="w-32"
                type="number"
                onChange={setKmArrivee}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-40">
              <TitreLabel titre="P.U (Ariary)" />
              <InputOn
                value={prix}
                width="w-40"
                type="number"
                onChange={setPrix}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <TitreLabel titre="Total (km)" />
              <InputOn
                disabled={true}
                value={totalKm}
                width="w-32"
                type="number"
                onChange={() => {}}
                height="h-9"
              />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <TitreLabel titre="Qtt (litre)" />
              <InputOn
                value={qttLitre}
                width="w-32"
                type="number"
                onChange={setQttLitre}
                height="h-9"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <TitreLabel titre="Montant (Ariary)" />
              <InputOn
                disabled={true}
                value={montant}
                width="w-full"
                type="number"
                onChange={() => {}}
                height="h-9"
              />
            </div>
            <ButtonAdd
              label="Enregistrer"
              onClick={handleSubmit}
              isLoad={isLoading}
            />
          </div>
        )}
        {onePlanning
          .filter((item) => {
            const { month, year } = getMonthAndYearFromDate(item.date);
            return (
              month === selectedMonth.toLowerCase() && year === selectedYear
            );
          })
          .map((item) => (
            <OnePlanning key={item.id} item={item} />
          ))}
        {isLoadingPlanning && (
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-blue-500 text-2xl py-10"
            pulse
          />
        )}
      </div>
      <div className="w-[35%] border-l-4 border-blue-500 p-2 px-4">
        <h1 className="text-sm font-bold uppercase">Activités :</h1>
        {oneVehicule?.utilisations
          ?.filter((item) => {
            const { month, year } = getMonthAndYearFromDate(item.date);
            return (
              month === selectedMonth.toLowerCase() && year === selectedYear
            );
          })
          ?.map((item) => (
            <OnePlanning key={item.id} item={item} />
          ))}
        {isLoadingUtilisation && (
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-blue-500 text-2xl py-5"
            pulse
          />
        )}
      </div>
    </div>
  );
}

export default function PlannifierContent({ selectedMonth, selectedYear }) {
  return (
    <MaterielContextProvider>
      <PlannifierComp
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    </MaterielContextProvider>
  );
}
