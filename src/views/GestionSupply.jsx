import React, { useState } from "react";
import Entete from "../composants/Entete";
import SupplyForm from "../composants/SupplyForm";
import SupplyTable from "../composants/Supplytable";
import { SupplyContext } from "../contexte/useSupply";
import { useContext } from "react";
import Empty from "../composants/Empty";
import ButtonExcel from "../composants/ButtonExcel";
import ButtonPdf from "../composants/ButtonPdf";
import { useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import logo from "../images/liste-de-controle.png";

export default function GestionSupply() {
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadPdf, setIsLoadPdf] = useState(false);
  const [isLoadExcel, setIsLoadExcel] = useState(false);
  const { isLoadingSpin, supplies, getSupplyParIdRegion, getAllSupply } = useContext(SupplyContext);
  const [selectedRegionName, setSelectedRegionName] = useState("");

  useEffect(() => {
    let region = JSON.parse(localStorage.getItem('region'));
    if (region) {
      getSupplyParIdRegion(region.id);
    } else {
      getAllSupply();
    }
    if(JSON.parse(localStorage.getItem('user')).region_id){
      setSelectedRegionName(region.nom);
    }
  }, []);

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
    doc.text(`LIEU: ${selectedRegionName ? selectedRegionName : "Toutes"}`, 20, 90);
    doc.text("OBJET: LISTE DES APPROVISIONNEMENTS", 20, 100);

    // Ajouter le tableau des approvisionnements
    const headers = [
      "Matériel", "Région", "Stock initial", "Stock final", "Rubrique",
      "Lieu destination", "Numéro BE", "Date", "Transporteur",
      "Observations", "Réceptionnaire"
    ];

    let y = 110;
    const columnWidths = [25, 25, 22, 22, 25, 25, 22, 22, 25, 25, 25];
    const paddingBottom = 2;

    const wrapText = (text, maxWidth) => {
      const words = String(text).split(" ");
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const lineWidth = doc.getTextWidth(currentLine + " " + word);
        if (lineWidth < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.1);
    headers.forEach((header, i) => {
      doc.setFillColor(249, 250, 251);
      doc.rect(14 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, columnWidths[i], 10, "FD");
      doc.setTextColor(75, 85, 99);
      doc.text(header, 16 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y + 7);
    });

    y += 10;

    supplies.forEach((supply) => {
      const rowData = [
        supply.nom || "",
        supply.region?.nom || "",
        supply.stock_initial || "",
        supply.stock_final || "",
        supply.rubrique || "",
        supply.lieu_destination || "",
        supply.numero_be || "",
        supply.date || "",
        supply.transporteur || "",
        supply.observation || "",
        supply.receptionnaire || ""
      ];

      let maxLines = 1;
      const linesArray = rowData.map((data, i) => {
        const lines = wrapText(data.toString(), columnWidths[i] - 2);
        if (lines.length > maxLines) {
          maxLines = lines.length;
        }
        return lines;
      });

      const rowHeight = maxLines * 5 + paddingBottom;

      linesArray.forEach((lines, i) => {
        lines.forEach((line, j) => {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(17, 24, 39);
          doc.text(
            line,
            16 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
            y + 5 + j * 5
          );
        });
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.05);
        doc.rect(
          14 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
          y,
          columnWidths[i],
          rowHeight
        );
      });

      y += rowHeight;

      if (y > 180) {
        doc.addPage("landscape");
        y = 20;
      }
    });

    // Ajouter la date d'exportation
    const exportDate = new Date().toLocaleString();
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    doc.text(`Exporté le: ${exportDate}`, 15, y + 5);

    doc.save(`Liste des approvisionnements ${selectedRegionName} ${new Date().getFullYear()}.pdf`);
    setIsLoadPdf(false);
  };

  const exportToExcel = () => {
    setIsLoadExcel(true);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);

    // Ajouter les informations d'en-tête
    XLSX.utils.sheet_add_aoa(ws, [
      ["Sehatra Amparihasombintsika Hoan'ny Iom-panitra"],
      ["BP 806 Diego Suarez | Email: sahieahi@gmail.com | Web: sahieassociation.org"],
      ["Tel: +261 32 04 765 02 / +261 34 20 9420 765 04"],
      [""],
      ["ASSOCIATION: SAHI"],
      ["PROJET: SAHI MADIO"],
      [`ANNEE: ${new Date().getFullYear()}`],
      ["OBJET: LISTE DES APPROVISIONNEMENTS"],
      [""]
    ], { origin: "A1" });

    // Style pour les en-têtes
    for (let i = 1; i <= 8; i++) {
      ws[`A${i}`].s = {
        font: { bold: true, color: { rgb: "4B5563" } },
        alignment: { horizontal: "left" }
      };
    }

    // Ajouter les en-têtes du tableau
    const headers = [
      "Matériel", "Région", "Stock initial", "Stock final", "Rubrique",
      "Lieu destination", "Numéro BE", "Date", "Transporteur",
      "Observations", "Réceptionnaire"
    ];

    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A10" });

    // Style pour les en-têtes du tableau
    const headerRow = 10;
    for (let i = 0; i < headers.length; i++) {
      const cell = XLSX.utils.encode_cell({ r: headerRow - 1, c: i });
      ws[cell].s = {
        fill: { fgColor: { rgb: "F9FAFB" } },
        font: { bold: true, color: { rgb: "4B5563" } },
        border: {
          top: { style: "thin", color: { rgb: "E5E7EB" } },
          bottom: { style: "thin", color: { rgb: "E5E7EB" } },
          left: { style: "thin", color: { rgb: "E5E7EB" } },
          right: { style: "thin", color: { rgb: "E5E7EB" } }
        }
      };
    }

    // Ajouter les données
    const data = supplies.map(supply => [
      supply.nom || "",
      supply.region?.nom || "",
      supply.stock_initial || "",
      supply.stock_final || "",
      supply.rubrique || "",
      supply.lieu_destination || "",
      supply.numero_be || "",
      supply.date || "",
      supply.transporteur || "",
      supply.observation || "",
      supply.receptionnaire || ""
    ]);

    XLSX.utils.sheet_add_aoa(ws, data, { origin: "A11" });

    // Style pour les données
    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 10, c: colIndex });
        ws[cellRef].s = {
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

    // Ajuster la largeur des colonnes
    const wscols = [
      { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
      { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 25 },
      { wch: 20 }
    ];
    ws['!cols'] = wscols;

    // Ajouter la date d'exportation
    const exportDate = new Date().toLocaleString();
    const lastRow = data.length + 11;
    XLSX.utils.sheet_add_aoa(ws, [[`Exporté le: ${exportDate}`]], { origin: `A${lastRow + 1}` });
    ws[`A${lastRow + 1}`].s = { font: { color: { rgb: "4B5563" } } };

    XLSX.utils.book_append_sheet(wb, ws, "Approvisionnements");
    XLSX.writeFile(wb, `Liste des approvisionnements ${selectedRegionName} ${new Date().getFullYear()}.xlsx`);
    setIsLoadExcel(false);
  };

  return (
    <div onClick={() => setShowFilters(false)} className="w-[80vw] mx-auto">
      <Entete titre="Intrant" description="gérez vos stocks provisoires" />
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
          <Empty titre="Aucun matériel n'a été trouvé" />
        </div>
      ) : (
        <div>
          <SupplyTable
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            selectedRegionName={selectedRegionName}
          />
          <div className="flex items-center justify-end mt-4 gap-2">
            <ButtonExcel isLoading={isLoadExcel} onClick={exportToExcel} />
            <ButtonPdf isLoading={isLoadPdf} onClick={exportToPDF} />
          </div>
        </div>
      )}
    </div>
  );
}
