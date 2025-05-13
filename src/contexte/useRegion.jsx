import { createContext, useContext, useState } from "react";
import { UrlContext } from "./useUrl";
import nProgress from "nprogress";
import axios from "axios";
import Notiflix from "notiflix";

export const RegionContext = createContext({});

export function RegionContextProvider({ children }) {
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { url } = useContext(UrlContext);

  async function getAllRegion() {
    try {
      nProgress.start();
      setIsLoading(true);
      setRegions([]);
      
      const response = await axios.get(`${url}/api/regions`);
      const regionData = Array.isArray(response.data) ? response.data : [response.data];
      setRegions(regionData);
    } catch (error) {
      console.error(error);
      Notiflix.Report.failure(
        'Erreur',
        'Impossible de charger les régions',
        'OK'
      );
    } finally {
      setIsLoading(false);
      nProgress.done();
    }
  }

  return (
    <RegionContext.Provider
      value={{
        regions,
        isLoading,
        setRegions,
        setIsLoading,
        getAllRegion
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function RegionSkeleton() {
  return (
    <div className="flex flex-row gap-2 mt-4">
      <div className="animate-pulse bg-gray-300 w-12 h-12 rounded-full"></div>
      <div className="flex flex-col gap-2">
        <div className="animate-pulse bg-gray-300 w-28 h-5 rounded-full"></div>
        <div className="animate-pulse bg-gray-300 w-36 h-5 rounded-full"></div>
      </div>
    </div>
  );
}
