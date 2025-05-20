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
import { faGlobe, faFilter, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function SupplyTable({ showFilters, setShowFilters }) {
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
    <div onClick={(e) => e.stopPropagation()} className="my-2">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center justify-center p-2 cursor-pointer rounded-lg hover:bg-blue-100 transition-colors duration-200 ${
          showFilters ? "bg-blue-100" : "bg-blue-50"
        }`}
      >
        <FontAwesomeIcon icon={faFilter} className="h-4 w-4 text-blue-400" />
      </button>

      {showFilters && (
        <div className="bg-gray-50 flex flex-col rounded-lg border absolute shadow-lg">
          <div className="flex items-center justify-end px-1 py-1">
            <FontAwesomeIcon
              onClick={() => setShowFilters(false)}
              icon={faXmark}
              className="text-red-400 cursor-pointer bg-red-100 rounded-full py-1.5 px-2"
            />
          </div>
          <p className="flex items-center text-lg gap-2 text-gray-700 font-semibold  uppercase px-4">
            <FontAwesomeIcon icon={faGlobe} className="text-blue-500" />
            Ville
          </p>
          <div className="flex items-center gap-2 px-4 mb-6 mt-2">
            <InputSearch
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Rechercher"
              width="w-40"
            />
            <Select
              value={region}
              onValueChange={(value) => {
                setRegion(value);
              }}
            >
              <SelectTrigger className="focus:outline-none bg-white border-2 border-blue-200 rounded-3xl p-2 w-40 px-4">
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
    </div>
  );
}
