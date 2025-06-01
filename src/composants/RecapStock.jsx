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
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import logo from "../images/liste-de-controle.png";

export default function RecapStock({
  total,
  inGoodCondition,
  inBadCondition,
  status,
  materielsGroupes,
  setStatus,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadPdf, setIsLoadPdf] = useState(false);
  const [isLoadExcel, setIsLoadExcel] = useState(false);

  const isGoodCondition = (etat) =>
    etat === "Bon état" || etat === "État moyen";
  const isBadCondition = (etat) =>
    etat === "Mauvais état" || etat === "Hors service";

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
      const hasMatchingMaterials = categorie.types.some((type) =>
        type.materiels.some((materiel) =>
          status === "goodCondition"
            ? isGoodCondition(materiel.etat)
            : status === "badCondition"
            ? isBadCondition(materiel.etat)
            : true
        )
      );

      const matchesSearchTerm = categorie.nom
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return hasMatchingMaterials && matchesSearchTerm;
    });

  const exportToPDF = () => {
    setIsLoadPdf(true);
    const doc = new jsPDF({ orientation: "landscape" });

    // Fonction pour ajouter un logo
    const addLogo = (src, x, y, width, height) => {
      const img = new Image();
      img.src = src;
      doc.addImage(img, 'PNG', x, y, width, height);
    };

    // Ajouter les logos
    addLogo(logo, 20, 10, 40, 20);
    addLogo(logo, 230, 10, 40, 20);

    // Ajouter les informations de contact
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    doc.text("Sehatra Amparihasombintsika Hoan'ny Iom-panitra", 145, 20, { align: "center" });
    doc.setTextColor(0, 0, 255);
    doc.text("BP 806 Diego Suarez | Email: sahieahi@gmail.com | Web: sahieassociation.org", 145, 25, { align: "center" });
    doc.setTextColor(75, 85, 99);
    doc.text("Tel: +261 32 04 765 02 / +261 34 20 9420 765 04", 145, 30, { align: "center" });

    // Ajouter les détails du projet
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(75, 85, 99);
    doc.text("ASSOCIATION: SAHI", 20, 60);
    doc.text("PROJET: SAHI MADIO", 20, 70);
    doc.text(`ANNEE: ${new Date().getFullYear()}`, 20, 80);
    doc.text("OBJET: RECAPITULATIF DES STOCKS", 20, 90);
    doc.text(`ETAT: ${status === "goodCondition" ? "Bon état" : status === "badCondition" ? "Mauvais état" : "Total"}`, 20, 100);

    let y = 110;

    // Ajouter les statistiques globales
    doc.setFontSize(10);
    doc.text(`Total: ${total} | Bon état: ${inGoodCondition} | Mauvais état: ${inBadCondition}`, 20, y);
    y += 10;

    // Pour chaque catégorie
    filteredCategories.forEach((categorie) => {
      // Vérifier si on doit ajouter une nouvelle page
      if (y > 180) {
        doc.addPage("landscape");
        y = 5;
      }

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(`${categorie.nom}`, 20, y);
      y += 10;

      // En-têtes pour les types
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.setTextColor(75, 85, 99);

      // Dessiner l'en-tête du tableau
      doc.rect(20, y, 150, 8, "FD");
      doc.text("Type", 25, y + 6);
      doc.text("Nombre de matériels", 120, y + 6);
      y += 8;

      // Données des types
      const typeData = categorie.types.filter(type => type.materiels.length > 0);
      
      typeData.forEach((type, index) => {
        // Vérifier si on doit ajouter une nouvelle page
        if (y > 180) {
          doc.addPage("landscape");
          y = 20;
        }

        doc.setFont("helvetica", "normal");
        doc.setTextColor(17, 24, 39);
        doc.setFillColor(255, 255, 255);

        // Dessiner la ligne du tableau
        doc.rect(20, y, 150, 8, "FD");
        doc.text(type.nom, 25, y + 6);
        doc.text(type.materiels.length.toString(), 120, y + 6);
        y += 8;
      });

      y += 10; // Espace entre les catégories
    });

    // Ajouter la date d'exportation
    const exportDate = new Date().toLocaleString();
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    doc.text(`Exporté le: ${exportDate}`, 20, y + 10);

    doc.save(`Récapitulatif des stocks ${new Date().getFullYear()}.pdf`);
    setIsLoadPdf(false);
  };

  const exportToExcel = () => {
    setIsLoadExcel(true);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);

    // Ajouter les informations d'en-tête
    const headers = [
      ["Sehatra Amparihasombintsika Hoan'ny Iom-panitra"],
      ["BP 806 Diego Suarez | Email: sahieahi@gmail.com | Web: sahieassociation.org"],
      ["Tel: +261 32 04 765 02 / +261 34 20 9420 765 04"],
      [""],
      ["ASSOCIATION: SAHI"],
      ["PROJET: SAHI MADIO"],
      [`ANNEE: ${new Date().getFullYear()}`],
      ["OBJET: RECAPITULATIF DES STOCKS"],
      [`ETAT: ${status === "goodCondition" ? "Bon état" : status === "badCondition" ? "Mauvais état" : "Total"}`],
      [""],
      [`Total: ${total} | Bon état: ${inGoodCondition} | Mauvais état: ${inBadCondition}`],
      [""]
    ];

    XLSX.utils.sheet_add_aoa(ws, headers, { origin: "A1" });

    // Style pour les en-têtes
    for (let i = 1; i <= headers.length; i++) {
      ws[`A${i}`].s = {
        font: { bold: true, color: { rgb: "4B5563" } },
        alignment: { horizontal: "left" }
      };
    }

    let currentRow = headers.length + 1;

    // Pour chaque catégorie
    filteredCategories.forEach((categorie) => {
      // Ajouter le nom de la catégorie
      XLSX.utils.sheet_add_aoa(ws, [[categorie.nom]], { origin: `A${currentRow}` });
      ws[`A${currentRow}`].s = {
        font: { bold: true, size: 12, color: { rgb: "000000" } }
      };
      currentRow++;

      // En-têtes pour les types
      const typeHeaders = ["Type", "Nombre de matériels"];
      XLSX.utils.sheet_add_aoa(ws, [typeHeaders], { origin: `A${currentRow}` });
      
      // Style pour les en-têtes de type
      ["A", "B"].forEach(col => {
        ws[`${col}${currentRow}`].s = {
          font: { bold: true, color: { rgb: "4B5563" } },
          fill: { fgColor: { rgb: "F9FAFB" } },
          border: {
            top: { style: "thin", color: { rgb: "E5E7EB" } },
            bottom: { style: "thin", color: { rgb: "E5E7EB" } },
            left: { style: "thin", color: { rgb: "E5E7EB" } },
            right: { style: "thin", color: { rgb: "E5E7EB" } }
          }
        };
      });
      currentRow++;

      // Données des types
      const typeData = categorie.types
        .filter(type => type.materiels.length > 0)
        .map(type => [type.nom, type.materiels.length]);

      if (typeData.length > 0) {
        XLSX.utils.sheet_add_aoa(ws, typeData, { origin: `A${currentRow}` });
        
        // Style pour les données
        typeData.forEach((_, index) => {
          ["A", "B"].forEach(col => {
            ws[`${col}${currentRow + index}`].s = {
              font: { color: { rgb: "111827" } },
              border: {
                top: { style: "thin", color: { rgb: "E5E7EB" } },
                bottom: { style: "thin", color: { rgb: "E5E7EB" } },
                left: { style: "thin", color: { rgb: "E5E7EB" } },
                right: { style: "thin", color: { rgb: "E5E7EB" } }
              }
            };
          });
        });
        currentRow += typeData.length + 1;
      }
    });

    // Ajuster la largeur des colonnes
    const wscols = [{ wch: 40 }, { wch: 20 }];
    ws['!cols'] = wscols;

    // Ajouter la date d'exportation
    const exportDate = new Date().toLocaleString();
    XLSX.utils.sheet_add_aoa(ws, [[`Exporté le: ${exportDate}`]], { origin: `A${currentRow + 1}` });
    ws[`A${currentRow + 1}`].s = { font: { color: { rgb: "4B5563" } } };

    XLSX.utils.book_append_sheet(wb, ws, "Récapitulatif");
    XLSX.writeFile(wb, `Récapitulatif des stocks ${new Date().getFullYear()}.xlsx`);
    setIsLoadExcel(false);
  };

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
                    <span>{categorie.nom}</span>
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="border-t">
                {categorie.types.map((type) => {
                  return (
                    <div
                      key={type.id}
                      className='flex items-center gap-2 justify-between'
                    >
                      <div className="flex items-center py-2 gap-2">
                        <FontAwesomeIcon
                          icon={faFolder}
                          className='text-yellow-500'
                        />
                        <p
                          className='truncate '
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
          <ButtonExcel isLoading={isLoadExcel} onClick={exportToExcel} />
          <ButtonPdf isLoading={isLoadPdf} onClick={exportToPDF} />
        </div>
      )}
    </div>
  );
}
