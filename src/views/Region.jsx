import React from "react";
import { faThumbtack, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormRegion from "@/composants/FormRegion";
import InputSearch from "@/composants/InputSearch";
import FilterCroissant from "@/composants/FilterCroissant";
import FilterDecroissant from "@/composants/FilterDecroissant";

export default function Region() {
  return (
    <div className=" w-[60vw] mx-auto">
      <div className="border-b-2 border-gray-100 py-2">
        <h1 className="text-3xl font-bold text-gray-700 mt-10">
          Gestion des <b className="text-gray-400 uppercase">régions</b>
        </h1>
        <p className="flex items-center mt-4 gap-1 text-gray-700">
          <FontAwesomeIcon icon={faThumbtack} className="text-yellow-500" /> «{" "}
          <b>Ajouter, modifier ou supprimer</b> » les régions où se trouvent vos
          bureaux.
        </p>
      </div>
      <FormRegion />
      <div className="mt-4 flex items-center gap-2">
        <InputSearch />
        <FilterCroissant />
        <FilterDecroissant />
      </div>
      <div className=" p-4 text-gray-700">
        <h1 className="font-bold text-lg ">Liste des régions</h1>
        <div className="bg-gray-50 rounded mt-2 py-2 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <input type="text" value="Toamasina" className="p-2" />
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faTrash} className="text-red-500 bg-red-200 p-2 rounded-full" />
            <FontAwesomeIcon
              icon={faPen}
              className="text-blue-500 bg-blue-200 p-2 rounded-full"
            />{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
