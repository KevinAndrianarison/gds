import React, { useState } from "react";
import Entete from "../composants/Entete";
import SupplyForm from "../composants/SupplyForm";
import SupplyTable from "../composants/Supplytable";

export default function GestionSupply() {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <div onClick={() => setShowFilters(false)} className="w-[80vw] mx-auto">
      <Entete titre="supply" description="gérez vos stocks" />
      <SupplyForm />
      <SupplyTable showFilters={showFilters} setShowFilters={setShowFilters} />
    </div>
  );
}
