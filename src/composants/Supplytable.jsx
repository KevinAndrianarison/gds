import InputSearch from "./InputSearch";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegionContext } from "@/contexte/useRegion";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function SupplyTable() {
  const [searchValue, setSearchValue] = useState("");
  const [region, setRegion] = useState("");
  const { regions, getAllRegion } = useContext(RegionContext);

  useEffect(() => {
    const fetchData = async () => {
      await getAllRegion();
    };
    fetchData();
  }, []);

  return (
    <div>
      <p className="flex items-center text-lg gap-2 text-gray-700 my-4">
        <FontAwesomeIcon icon={faGlobe} className="text-blue-500" />
        Ville
      </p>
      <div className="flex items-center gap-2">
        <InputSearch
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Rechercher un matériel..."
        />
        <Select
          value={region}
          onValueChange={(value) => setRegion(value)}
          placeholder="Rechercher une région..."
        >
          <SelectTrigger className="focus:outline-none border-2 border-blue-200 rounded p-2 w-60">
            <SelectValue placeholder="Rechercher une région..." />
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
  );
}
