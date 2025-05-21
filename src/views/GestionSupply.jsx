import React, { useState } from "react";
import Entete from "../composants/Entete";
import SupplyForm from "../composants/SupplyForm";
import SupplyTable from "../composants/Supplytable";
import { SupplyContext } from "../contexte/useSupply";
import { useContext } from "react";
import Empty from "../composants/Empty";

export default function GestionSupply() {
  const [showFilters, setShowFilters] = useState(false);
  const { isLoadingSpin, supplies } = useContext(SupplyContext);
  return (
    <div onClick={() => setShowFilters(false)} className="w-[80vw] mx-auto">
      <Entete titre="supply" description="gérez vos stocks" />
      <SupplyForm />
      {isLoadingSpin ? (
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
      ) : supplies.length === 0 ? (
        <div className="my-10">
          <Empty titre="Aucun supply n'a été trouvé" />
        </div>
      ) : (
        <SupplyTable showFilters={showFilters} setShowFilters={setShowFilters} />
      )}
    </div>
  );
}
