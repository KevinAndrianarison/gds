import { createContext, useContext, useEffect, useState } from "react";
import { UrlContext } from "./useUrl";
import axios from "axios";
import nProgress from "nprogress";
export const SupplyContext = createContext({});

export function SupplyContextProvider({ children }) {
  const [supplies, setSupplies] = useState([]);
  const { url } = useContext(UrlContext);
  const [isLoadingSpin, setIsLoadingSpin] = useState(false);

  const getAllSupply = async () => {
    nProgress.start();
    setIsLoadingSpin(true);
    try {
      const response = await axios.get(`${url}/api/supplies`);
      setSupplies(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      nProgress.done();
      setIsLoadingSpin(false);
    }
  };

  useEffect(() => {
    getAllSupply();
  }, []);

  return (
    <SupplyContext.Provider
      value={{
        supplies,
        setSupplies,
        getAllSupply,
        isLoadingSpin,
      }}
    >
      {children}
    </SupplyContext.Provider>
  );
}
