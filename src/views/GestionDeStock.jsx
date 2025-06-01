import React, { useState, useEffect, useContext } from "react";
import Entete from "@/composants/Entete";
import StatsCards from "@/composants/stock/StatsCards";
import SearchFilters from "@/composants/stock/SearchFilters";
import MaterielsTable from "@/composants/stock/MaterielsTable";
import AddMaterielModal from "@/composants/stock/AddMaterielModal";
import Empty from "@/composants/Empty";
import { MaterielContextProvider, useMateriel } from "@/contexte/useMateriel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { ShowContext } from "@/contexte/useShow";
import ButtonExcel from "@/composants/ButtonExcel";
import ButtonPdf from "@/composants/ButtonPdf";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import logo from "../images/liste-de-controle.png";

export default function GestionDeStock() {
  return (
    <MaterielContextProvider>
      <GestionDeStockContent />
    </MaterielContextProvider>
  );
}

function GestionDeStockContent() {
  const {
    materiels,
    materielsTemp,
    getAllMateriels,
    isLoading,
    deleteMateriel,
    getMaterielParIdRegion,
    setMateriels,
  } = useMateriel();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categorie, setCategorie] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedRegionName, setSelectedRegionName] = useState("");
  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const [etat, setEtat] = useState("");
  const [showAll, setShowAll] = useState(false);
  const nomRegion = JSON.parse(localStorage.getItem("region"))?.nom;
  const { isACL } = useContext(ShowContext);
  const [isLoadPdf, setIsLoadPdf] = useState(false);
  const [isLoadExcel, setIsLoadExcel] = useState(false);
  const [filteredMateriels, setFilteredMateriels] = useState([]);
  const [materielsGroupes, setMaterielsGroupes] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.region_id) {
        const region = JSON.parse(localStorage.getItem("region"));
        setRegion(region.id);
        setSelectedRegionName(region.nom);
        getMaterielParIdRegion(user.region_id);
      } else {
        getAllMateriels();
      }
    } else {
      getAllMateriels();
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
  
      // Ajouter les logos avec des tailles ajustées
      addLogo(logo, 20, 10, 40, 20); // Logo de gauche
      addLogo(logo, 230, 10, 40, 20); // Logo de droite
  
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
      doc.setTextColor(75, 85, 99); // couleur gris
      doc.text("ASSOCIATION: SAHI", 20, 60);
      doc.text("PROJET: SAHI MADIO", 20, 70);
      doc.text(`ANNEE: ${new Date().getFullYear()}`, 20, 80);
      doc.text(`LIEU: ${selectedRegionName}`, 20, 90);
      doc.text(`OBJET: INVENTAIRE ${selectedCategoryName}`, 20, 100);
  
      // Ajouter le tableau des matériels
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      const headers = [
          "N° Référence", "Appartenance", "Type", "Marque", "Caractéristiques",
          "État", "Montant (Ar)", "N° Série", "N° IMEI", "Date d'acquisition",
          "Région", "Responsable"
      ];
  
      let y = 110;
      const columnWidths = [22, 22, 22, 22, 32, 22, 22, 22, 22, 27, 22, 22];
      const paddingBottom = 2;
  
      const wrapText = (text, maxWidth) => {
          const words = text.split(" ");
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
  
      materiels.forEach((materiel) => {
          const rowData = [
              materiel.numero || "",
              materiel.appartenance?.nom || "",
              materiel.type?.nom || "",
              materiel.marque || "",
              materiel.caracteristiques || "",
              materiel.etat === "Bon état" ? "Bon état" : materiel.etat === "État moyen" ? "État moyen" : materiel.etat === "Mauvais état" ? "Mauvais état" : "Inconnu",
              materiel.montant || "",
              materiel.numero_serie || "",
              materiel.numero_imei || "",
              materiel.date_acquisition || "",
              materiel.region?.nom || "",
              materiel.responsable?.name || "Non assigné",
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
                  if (i === 5) {
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
  
      // Ajouter la date d'exportation sous le tableau
      const exportDate = new Date().toLocaleString();
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      doc.text(`Exporté le: ${exportDate}`, 15, y + 5);
  
      doc.save(`Liste des materiels ${selectedRegionName} ${selectedCategoryName} ${new Date().getFullYear()}.pdf`);
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
      [`LIEU: ${selectedRegionName ? selectedRegionName : "Toutes"}`],
      [`OBJET: INVENTAIRE ${selectedCategoryName ? selectedCategoryName : "Toutes"}`],
      [""]
    ], {origin: "A1"});

    // Style pour les en-têtes (couleur grise)
    for (let i = 1; i <= 9; i++) {
      ws[`A${i}`].s = {
        font: { bold: true, color: { rgb: "4B5563" } },
        alignment: { horizontal: "left" }
      };
    }

    // Ajouter les en-têtes du tableau
    const headers = [
      "N° Référence", "Appartenance", "Type", "Marque", "Caractéristiques",
      "État", "Montant (Ar)", "N° Série", "N° IMEI", "Date d'acquisition",
      "Région", "Responsable"
    ];

    XLSX.utils.sheet_add_aoa(ws, [headers], {origin: "A11"});

    // Style pour les en-têtes du tableau
    const headerRow = 11;
    for (let i = 0; i < headers.length; i++) {
      const cell = XLSX.utils.encode_cell({r: headerRow-1, c: i});
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
    const data = materiels.map(materiel => [
      materiel.numero || "",
      materiel.appartenance?.nom || "",
      materiel.type?.nom || "",
      materiel.marque || "",
      materiel.caracteristiques || "",
      materiel.etat === "Bon état" ? "Bon état" : 
      materiel.etat === "État moyen" ? "État moyen" : 
      materiel.etat === "Mauvais état" ? "Mauvais état" : "Inconnu",
      materiel.montant || "",
      materiel.numero_serie || "",
      materiel.numero_imei || "",
      materiel.date_acquisition || "",
      materiel.region?.nom || "",
      materiel.responsable?.name || "Non assigné"
    ]);

    XLSX.utils.sheet_add_aoa(ws, data, {origin: "A12"});

    // Style pour les données
    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellRef = XLSX.utils.encode_cell({r: rowIndex + 11, c: colIndex});
        ws[cellRef].s = {
          font: { color: { rgb: "111827" } },
          border: {
            top: { style: "thin", color: { rgb: "E5E7EB" } },
            bottom: { style: "thin", color: { rgb: "E5E7EB" } },
            left: { style: "thin", color: { rgb: "E5E7EB" } },
            right: { style: "thin", color: { rgb: "E5E7EB" } }
          }
        };

        // Style spécial pour la colonne "État"
        if (colIndex === 5) {
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
      {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 25},
      {wch: 15}, {wch: 15}, {wch: 15}, {wch: 15}, {wch: 20},
      {wch: 15}, {wch: 15}
    ];
    ws['!cols'] = wscols;

    // Ajouter la date d'exportation
    const exportDate = new Date().toLocaleString();
    const lastRow = data.length + 12;
    XLSX.utils.sheet_add_aoa(ws, [[`Exporté le: ${exportDate}`]], {origin: `A${lastRow + 1}`});
    ws[`A${lastRow + 1}`].s = { font: { color: { rgb: "4B5563" } } };

    XLSX.utils.book_append_sheet(wb, ws, "Materiels");
    XLSX.writeFile(wb, `Liste des materiels ${selectedRegionName} ${selectedCategoryName} ${new Date().getFullYear()}.xlsx`);
    setIsLoadExcel(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce matériel ?"))
      return;
    try {
      await deleteMateriel(id);
      await getAllMateriels();
    } catch (err) {
      setError("Erreur lors de la suppression du matériel");
      console.error(err);
    }
  };

  const FilteredMateriels = materiels.filter((materiel) => {
    const matchesSearch =
      (materiel.categorie.nom &&
        materiel.categorie.nom
          .toLowerCase()
          .includes(searchValue.toLowerCase())) ||
      (materiel.type.nom &&
        materiel.type.nom.toLowerCase().includes(searchValue.toLowerCase()));
    const matchesCategorie = !categorie || materiel.categorie_id === categorie;
    const matchesRegion = !region || materiel.region_id === region;
    const matchesEtat = !etat || materiel.etat === etat;
    return matchesSearch && matchesCategorie && matchesRegion && matchesEtat;
  });

  function regrouperParCategorieEtType(materiels) {
    const result = [];

    materiels.forEach((materiel) => {
      const { categorie, type } = materiel;
      let categorieExistante = result.find((cat) => cat.id === categorie.id);
      if (!categorieExistante) {
        categorieExistante = {
          id: categorie.id,
          nom: categorie.nom,
          types: [],
        };
        result.push(categorieExistante);
      }
      let typeExistant = categorieExistante.types.find((t) => t.id === type.id);
      if (!typeExistant) {
        typeExistant = {
          id: type.id,
          nom: type.nom,
          materiels: [],
        };
        categorieExistante.types.push(typeExistant);
      }
      typeExistant.materiels.push(materiel);
    });
    return result;
  }

  useEffect(() => {
    setMaterielsGroupes(regrouperParCategorieEtType(FilteredMateriels));
    setFilteredMateriels(FilteredMateriels);
  }, [materiels, searchValue, categorie, region, etat]);

  return (
    <div className="w-[80vw] mx-auto" onClick={() => setShowFilters(false)}>
      <Entete titre="stocks" description="gérez vos matériels et équipements" />

      <StatsCards
        materielsGroupes={materielsGroupes}
        total={isLoading ? null : filteredMateriels.length}
        inGoodCondition={
          isLoading
            ? null
            : filteredMateriels.filter(
                (m) => m.etat === "Bon état" || m.etat === "État moyen"
              ).length
        }
        inBadCondition={
          isLoading
            ? null
            : filteredMateriels.filter(
                (m) => m.etat === "Mauvais état" || m.etat === "Hors service"
              ).length
        }
        isLoading={isLoading}
      />
      {isACL && (
        <p className="flex items-center text-lg gap-2 text-gray-700 my-4">
          <FontAwesomeIcon className="text-blue-500" icon={faGlobe} />
          {nomRegion}
        </p>
      )}

      <SearchFilters
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        categorie={categorie}
        setCategorie={setCategorie}
        region={region}
        setRegion={setRegion}
        etat={etat}
        setEtat={setEtat}
        showAll={showAll}
        setShowAll={setShowAll}
        setSelectedCategoryName={setSelectedCategoryName}
        setSelectedRegionName={setSelectedRegionName}
        setMateriels={setMateriels}
        materielsTemp={materielsTemp}
        setFilteredMateriels={setFilteredMateriels}
      />
      {isLoading && materiels.length === 0 ? (
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
      ) : !isLoading && materiels.length === 0 ? (
        <Empty titre="Aucun matériel n'a été trouvé" />
      ) : (
        <MaterielsTable
          materiels={filteredMateriels}
          onDelete={handleDelete}
          onEdit={() => setShowAddModal(true)}
        />
      )}
      {filteredMateriels.length > 0 && (
        <div className="flex gap-2 my-4">
          <ButtonPdf isLoading={isLoadPdf} onClick={exportToPDF} />
          <ButtonExcel isLoading={isLoadExcel} onClick={exportToExcel} />
        </div>
      )}

      <AddMaterielModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
        }}
      />
    </div>
  );
}
