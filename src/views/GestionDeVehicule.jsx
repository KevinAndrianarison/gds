import React, { useEffect, useContext } from "react";
import Entete from "@/composants/Entete";
import { MaterielContextProvider, useMateriel } from "@/contexte/useMateriel";
import InputSearch from "@/composants/InputSearch";
import {
  faCarSide,
  faSpinner,
  faImage,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Empty from "@/composants/Empty";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ShowContext } from "@/contexte/useShow";
import { RegionContext } from "@/contexte/useRegion";
import { useState } from "react";
import TitreLabel from "@/composants/TitreLabel";
import ButtonPdf from "@/composants/ButtonPdf";
import ButtonExcel from "@/composants/ButtonExcel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UtiliseVehicule from "@/composants/UtiliseVehicule";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import logo from "../images/liste-de-controle.png";
import ListeImage from "@/composants/ListeImage";

function GestionDeVehiculeContent() {
  const { getAllVehicules, vehicules, isLoadingVehicules } = useMateriel();
  const navigate = useNavigate();
  const [region, setRegion] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const { isAdmin } = useContext(ShowContext);
  const { regions, getAllRegion } = useContext(RegionContext);
  const [filteredVehicules, setFilteredVehicules] = useState([]);
  const [isLoadPdf, setIsLoadPdf] = useState(false);
  const [isLoadExcel, setIsLoadExcel] = useState(false);
  const [selectedRegionName, setSelectedRegionName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    getAllRegion();
    getAllVehicules();
    if (JSON.parse(localStorage.getItem("user"))?.region_id) {
      const region = JSON.parse(localStorage.getItem("region"));
      setSelectedRegionName(region.nom);
    }
  }, []);

  // Initialiser filteredVehicules avec vehicules
  useEffect(() => {
    setFilteredVehicules(vehicules);
  }, [vehicules]);

  // Effet pour gérer la recherche et le filtrage par région
  useEffect(() => {
    let filtered = [...vehicules];

    // Filtre par région
    if (region && region !== "all") {
      filtered = filtered.filter((vehicule) => vehicule.region.id === region);
      const selectedRegion = regions.find((r) => r.id === region);
      setSelectedRegionName(selectedRegion ? selectedRegion.nom : "");
    } else {
      setSelectedRegionName("");
    }

    // Filtre par recherche
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(
        (vehicule) =>
          vehicule.type?.nom?.toLowerCase().includes(searchLower) ||
          vehicule.caracteristiques?.toLowerCase().includes(searchLower) ||
          vehicule.categorie?.nom?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredVehicules(filtered);
  }, [searchValue, vehicules, region, regions]);

  const exportToPDF = () => {
    setIsLoadPdf(true);
    const doc = new jsPDF({ orientation: "landscape" });

    // Fonction pour ajouter un logo
    const addLogo = (src, x, y, width, height) => {
      const img = new Image();
      img.src = src;
      doc.addImage(img, "PNG", x, y, width, height);
    };

    // Ajouter les logos
    addLogo(logo, 20, 10, 40, 20);
    addLogo(logo, 230, 10, 40, 20);

    // Ajouter les informations de contact
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    doc.text("Sehatra Amparihasombintsika Hoan'ny Iom-panitra", 145, 20, {
      align: "center",
    });
    doc.setTextColor(0, 0, 255);
    doc.text(
      "BP 806 Diego Suarez | Email: sahieahi@gmail.com | Web: sahieassociation.org",
      145,
      25,
      { align: "center" }
    );
    doc.setTextColor(75, 85, 99);
    doc.text("Tel: +261 32 04 765 02 / +261 34 20 9420 765 04", 145, 30, {
      align: "center",
    });

    // Ajouter les détails du projet
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(75, 85, 99);
    doc.text("ASSOCIATION: SAHI", 20, 60);
    doc.text("PROJET: SAHI MADIO", 20, 70);
    doc.text(`ANNEE: ${new Date().getFullYear()}`, 20, 80);
    doc.text(
      `LIEU: ${selectedRegionName ? selectedRegionName : "Toutes"}`,
      20,
      90
    );
    doc.text("OBJET: LISTE DES VEHICULES", 20, 100);

    // Ajouter le tableau des véhicules
    const headers = [
      "Type",
      "Caractéristiques",
      "Catégorie",
      "Région",
      "État",
      "Responsable",
      "Date d'acquisition",
      "Montant",
    ];

    let y = 110;
    const columnWidths = [25, 35, 25, 25, 20, 30, 30, 25];
    const paddingBottom = 2;

    const wrapText = (text, maxWidth) => {
      const words = String(text || "").split(" ");
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
      doc.rect(
        14 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y,
        columnWidths[i],
        10,
        "FD"
      );
      doc.setTextColor(75, 85, 99);
      doc.text(
        header,
        16 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y + 7
      );
    });

    y += 10;

    filteredVehicules.forEach((vehicule) => {
      const rowData = [
        vehicule.type?.nom || "",
        vehicule.caracteristiques || "",
        vehicule.categorie?.nom || "",
        vehicule.region?.nom || "",
        vehicule.etat || "",
        vehicule.responsable?.name || "Non assigné",
        vehicule.date_acquisition || "",
        vehicule.montant || "",
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
          if (i === 4) {
            // Pour la colonne État
            let color;
            switch (line) {
              case "Bon état":
                color = [34, 197, 94];
                break;
              case "État moyen":
                color = [250, 204, 21];
                break;
              case "Mauvais état":
                color = [248, 113, 113];
                break;
              default:
                color = [156, 163, 175];
            }
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...color);
          } else {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(17, 24, 39);
          }
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

    doc.save(
      `Liste des vehicules ${selectedRegionName} ${new Date().getFullYear()}.pdf`
    );
    setIsLoadPdf(false);
  };

  const exportToExcel = () => {
    setIsLoadExcel(true);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);

    // Ajouter les informations d'en-tête
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        ["Sehatra Amparihasombintsika Hoan'ny Iom-panitra"],
        [
          "BP 806 Diego Suarez | Email: sahieahi@gmail.com | Web: sahieassociation.org",
        ],
        ["Tel: +261 32 04 765 02 / +261 34 20 9420 765 04"],
        [""],
        ["ASSOCIATION: SAHI"],
        ["PROJET: SAHI MADIO"],
        [`ANNEE: ${new Date().getFullYear()}`],
        [`LIEU: ${selectedRegionName ? selectedRegionName : "Toutes"}`],
        ["OBJET: LISTE DES VEHICULES"],
        [""],
      ],
      { origin: "A1" }
    );

    // Style pour les en-têtes
    for (let i = 1; i <= 9; i++) {
      ws[`A${i}`].s = {
        font: { bold: true, color: { rgb: "4B5563" } },
        alignment: { horizontal: "left" },
      };
    }

    // Ajouter les en-têtes du tableau
    const headers = [
      "Type",
      "Caractéristiques",
      "Catégorie",
      "Région",
      "État",
      "Responsable",
      "Date d'acquisition",
      "Montant",
    ];

    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A11" });

    // Style pour les en-têtes du tableau
    const headerRow = 11;
    for (let i = 0; i < headers.length; i++) {
      const cell = XLSX.utils.encode_cell({ r: headerRow - 1, c: i });
      ws[cell].s = {
        fill: { fgColor: { rgb: "F9FAFB" } },
        font: { bold: true, color: { rgb: "4B5563" } },
        border: {
          top: { style: "thin", color: { rgb: "E5E7EB" } },
          bottom: { style: "thin", color: { rgb: "E5E7EB" } },
          left: { style: "thin", color: { rgb: "E5E7EB" } },
          right: { style: "thin", color: { rgb: "E5E7EB" } },
        },
      };
    }

    // Ajouter les données
    const data = filteredVehicules.map((vehicule) => [
      vehicule.type?.nom || "",
      vehicule.caracteristiques || "",
      vehicule.categorie?.nom || "",
      vehicule.region?.nom || "",
      vehicule.etat || "",
      vehicule.responsable?.name || "Non assigné",
      vehicule.date_acquisition || "",
      vehicule.montant || "",
    ]);

    XLSX.utils.sheet_add_aoa(ws, data, { origin: "A12" });

    // Style pour les données
    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellRef = XLSX.utils.encode_cell({
          r: rowIndex + 11,
          c: colIndex,
        });
        ws[cellRef].s = {
          font: { color: { rgb: "111827" } },
          border: {
            top: { style: "thin", color: { rgb: "E5E7EB" } },
            bottom: { style: "thin", color: { rgb: "E5E7EB" } },
            left: { style: "thin", color: { rgb: "E5E7EB" } },
            right: { style: "thin", color: { rgb: "E5E7EB" } },
          },
        };

        // Style spécial pour la colonne "État"
        if (colIndex === 4) {
          let color;
          switch (cell) {
            case "Bon état":
              color = "22C55E";
              break;
            case "État moyen":
              color = "FACC15";
              break;
            case "Mauvais état":
              color = "F87171";
              break;
            default:
              color = "9CA3AF";
          }
          ws[cellRef].s.font = { bold: true, color: { rgb: color } };
        }
      });
    });

    // Ajuster la largeur des colonnes
    const wscols = [
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
    ];
    ws["!cols"] = wscols;

    // Ajouter la date d'exportation
    const exportDate = new Date().toLocaleString();
    const lastRow = data.length + 12;
    XLSX.utils.sheet_add_aoa(ws, [[`Exporté le: ${exportDate}`]], {
      origin: `A${lastRow + 1}`,
    });
    ws[`A${lastRow + 1}`].s = { font: { color: { rgb: "4B5563" } } };

    XLSX.utils.book_append_sheet(wb, ws, "Vehicules");
    XLSX.writeFile(
      wb,
      `Liste des vehicules ${selectedRegionName} ${new Date().getFullYear()}.xlsx`
    );
    setIsLoadExcel(false);
  };

  return (
    <div className="w-[80vw] mx-auto">
      <Entete titre="des véhicules" description="gérer vos véhicules" />
      <div className="my-2">
        <InputSearch value={searchValue} onChange={setSearchValue} />
        <div className="mt-4 flex justify-between items-center">
          {isAdmin && (
            <div className="flex gap-2 flex-col gap-2">
              <TitreLabel titre="Filtrer par région :" />
              <div>
                {isAdmin && (
                  <Select
                    value={region}
                    onValueChange={(value) => {
                      setRegion(value);
                      setSelectedRegionName(
                        regions.find((reg) => reg.id === value)?.nom || ""
                      );
                    }}
                  >
                    <SelectTrigger className="focus:outline-none bg-white border-2 border-blue-200 rounded-3xl p-2 w-40 px-4">
                      <SelectValue placeholder="Région" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tout</SelectItem>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}
          <div>
            <TitreLabel titre="Effectif :" />
            {isLoadingVehicules ? (
              <FontAwesomeIcon
                icon={faSpinner}
                className="animate-spin"
                pulse
              />
            ) : (
              <p className="text-sm font-bold uppercase text-gray-500">
                {filteredVehicules.length}
              </p>
            )}
          </div>
        </div>
      </div>
      {isLoadingVehicules && filteredVehicules.length === 0 ? (
        <div className="mt-4 max-h-[500px] overflow-y-auto">
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
      ) : !isLoadingVehicules && filteredVehicules.length === 0 ? (
        <div className="my-10">
          <Empty titre="Aucun véhicule n'a été trouvé" />
        </div>
      ) : (
        <div className="mt-4 max-h-[500px] flex flex-col gap-2 overflow-y-auto">
          {filteredVehicules.map((vehicule) => (
            <div
              key={vehicule.id}
              onDoubleClick={() => {
                navigate(`/details-vehicule/${vehicule.id}`);
              }}
              className="shadow-xs cursor-pointer hover:bg-blue-50 hover:border-white bg-gray-50 rounded-xl p-2 px-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-5">
                <FontAwesomeIcon
                  className="text-blue-500 bg-blue-100 rounded-full p-1"
                  icon={faCarSide}
                />
                <div>
                  <h1 className="text-lg flex items-center gap-2 font-bold">
                    <p className="uppercase text-gray-700 ">
                      {vehicule.photos && vehicule.photos.length > 0 ? (
                        <FontAwesomeIcon
                          icon={faImage}
                          onClick={() => {
                            setPhotos(vehicule.photos);
                            setIsOpen(true);
                          }}
                          className="text-xs mr-2 cursor-pointer text-blue-500"
                        />
                      ) : (
                        ""
                      )}
                      {vehicule.type.nom}
                    </p>
                    <p className="text-gray-500 text-xs truncate max-w-[400px]">
                      {vehicule.caracteristiques &&
                        `(${vehicule.caracteristiques})`}
                    </p>
                  </h1>
                  <p className="text-xs uppercase text-gray-400">
                    {vehicule.categorie.nom}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Popover>
                  <PopoverTrigger
                    onClick={(e) => e.stopPropagation()}
                    className="bg-blue-500 text-white px-8 py-2 rounded cursor-pointer"
                  >
                    Utiliser
                  </PopoverTrigger>
                  <PopoverContent className="w-[500px]">
                    <UtiliseVehicule vehicule={vehicule} status="utiliser" />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gray-300 text-black text-gray-700 font-bold px-8 py-2 rounded cursor-pointer"
                  >
                    Assigner
                  </PopoverTrigger>
                  <PopoverContent className="w-[500px]">
                    <UtiliseVehicule vehicule={vehicule} status="assigner" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
        </div>
      )}
      {filteredVehicules.length > 0 && (
        <div className="mt-4 flex gap-2">
          <ButtonPdf isLoading={isLoadPdf} onClick={exportToPDF} />
          <ButtonExcel isLoading={isLoadExcel} onClick={exportToExcel} />
        </div>
      )}
            {isOpen && (
              <div
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-sm p-2"
                >
                  <div className="flex justify-end">
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="text-gray-700 cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    />
                  </div>
                  <ListeImage photos={photos} setPhotos={setPhotos} />
                </div>
              </div>
            )}
    </div>
  );
}

export default function GestionDeVehicule() {
  return (
    <MaterielContextProvider>
      <GestionDeVehiculeContent />
    </MaterielContextProvider>
  );
}
