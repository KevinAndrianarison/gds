import React, { useState } from "react";
import Entete from "../composants/Entete";
import SupplyForm from "../composants/SupplyForm";
import SupplyTable from "../composants/Supplytable";
import { SupplyContext } from "../contexte/useSupply";
import { useContext } from "react";
import Empty from "../composants/Empty";
import ButtonExcel from "../composants/ButtonExcel";
import ButtonPdf from "../composants/ButtonPdf";

export default function GestionSupply() {
  const [showFilters, setShowFilters] = useState(false);
  const { isLoadingSpin, supplies } = useContext(SupplyContext);
  return (
    <div onClick={() => setShowFilters(false)} className="w-[80vw] mx-auto">
      <Entete titre="supply" description="gérez vos stocks" />
      <SupplyForm />
      {isLoadingSpin && supplies.length === 0 ? (
        <div className="mt-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className=" rounded mb-4 p-4">
              <div className="grid grid-cols-8 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : !isLoadingSpin && supplies.length === 0 ? (
        <div className="my-10">
          <Empty titre="Aucun supply n'a été trouvé" />
        </div>
      ) : (
        <div>
          <SupplyTable
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
          <div className="flex items-center justify-end mt-4 gap-2">
            <ButtonExcel />
            <ButtonPdf />
          </div>
        </div>
      )}
    </div>
  );
}
