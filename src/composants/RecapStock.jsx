import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonPdf from "./ButtonPdf";
import { faTags, faFolder } from "@fortawesome/free-solid-svg-icons";
import ButtonExcel from "./ButtonExcel";
import InputSearch from "./InputSearch";

export default function RecapStock({
  total,
  inGoodCondition,
  inBadCondition,
  status,
  materielsGroupes,
  setStatus,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const isGoodCondition = (etat) => etat === "Bon état" || etat === "État moyen";
  const isBadCondition = (etat) => etat === "Mauvais état" || etat === "Hors service";

  const filteredCategories = materielsGroupes
    .map((categorie) => ({
      ...categorie,
      types: categorie.types.map((type) => ({
        ...type,
        materiels: type.materiels.filter((materiel) => {
          if (status === "goodCondition") {
            return isGoodCondition(materiel.etat);
          } else if (status === "badCondition") {
            return isBadCondition(materiel.etat);
          }
          return true;
        }),
      })),
    }))
    .filter((categorie) => {
      if (status === "goodCondition") {
        return categorie.types.some((type) => 
          type.materiels.some((materiel) => isGoodCondition(materiel.etat))
        );
      } else if (status === "badCondition") {
        return categorie.types.some((type) => 
          type.materiels.some((materiel) => isBadCondition(materiel.etat))
        );
      }
      return true;
    });

  return (
    <div className="flex justify-between flex-col pb-2 px-4 min-h-20">
      <h2 className="text-sm font-bold uppercase">Récapitulatif</h2>
      <div className="flex mt-4 gap-4">
        <h1
          onClick={() => setStatus("total")}
          className={
            status === "total"
              ? " border-b-2 border-blue-500 cursor-pointer text-blue-500"
              : "cursor-pointer text-gray-500"
          }
        >
          Total ({total})
        </h1>
        <h1
          onClick={() => setStatus("goodCondition")}
          className={
            status === "goodCondition"
              ? "border-b-2 border-blue-500 cursor-pointer text-blue-500"
              : "cursor-pointer text-gray-500"
          }
        >
          Bon état ({inGoodCondition})
        </h1>
        <h1
          onClick={() => setStatus("badCondition")}
          className={
            status === "badCondition"
              ? "border-b-2 border-blue-500 cursor-pointer text-blue-500"
              : "cursor-pointer text-gray-500"
          }
        >
          Mauvaise état ({inBadCondition})
        </h1>
      </div>
      <div className="mt-4">
        <InputSearch
          placeholder="Rechercher"
          width="w-full"
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>
      <div className="max-h-80 overflow-y-auto overflow-x-hidden">
        <Accordion type="single" collapsible>
          {filteredCategories.map((categorie) => (
            <AccordionItem key={categorie.id} value={categorie.id.toString()}>
              <AccordionTrigger>
                <div className="w-full flex items-center gap-2">
                  <FontAwesomeIcon icon={faTags} className="text-gray-500" />
                  <p className="truncate">
                    {categorie.nom.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                      <span>{categorie.nom}</span>
                    ) : (
                      categorie.nom
                    )}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="border-t">
                {categorie.types.map((type) => {
                  const hasMatchingMaterial = type.materiels.some((materiel) => {
                    if (status === "goodCondition") {
                      return isGoodCondition(materiel.etat);
                    } else if (status === "badCondition") {
                      return isBadCondition(materiel.etat);
                    }
                    return true;
                  });

                  return (
                    <div
                      key={type.id}
                      className={`flex items-center gap-2 justify-between ${
                        type.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        hasMatchingMaterial
                          ? ""
                          : ""
                      }`}
                    >
                      <div className="flex items-center py-2 gap-2">
                        <FontAwesomeIcon
                          icon={faFolder}
                          className={`text-yellow-500 ${
                            type.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            hasMatchingMaterial
                              ? "text-yellow-500"
                              : ""
                          }`}
                        />
                        <p
                          className={`truncate ${
                            type.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            hasMatchingMaterial
                              ? ""
                              : ""
                          }`}
                        >
                          {type.nom}
                        </p>
                      </div>
                      <p>{type.materiels.length} matériel(s)</p>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {filteredCategories.some((categorie) => 
        categorie.types.some((type) => type.materiels.length > 0)
      ) && (
        <div className="flex gap-2 my-2">
          <ButtonPdf />
          <ButtonExcel />
        </div>
      )}
    </div>
  );
}