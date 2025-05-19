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
    getAllMateriels,
    isLoading,
    deleteMateriel,
    getMaterielParIdRegion,
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

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 170, 255);
    doc.text("Détails des matériels", 14, 15);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("times", "bolditalic");
    const exportDate = new Date().toLocaleString();
    const selectedCategory = selectedCategoryName
      ? `- Catégorie : ${selectedCategoryName}`
      : "- Catégorie : Toutes";
    const selectedRegion = selectedRegionName
      ? `- Région: ${selectedRegionName}`
      : "- Région : Toutes";

    doc.text(selectedCategory, 14, 30);
    doc.text(selectedRegion, 14, 26);
    doc.setTextColor(77, 77, 77);
    doc.setFont("helvetica", "normal");
    doc.text(`Exporté le: ${exportDate}`, 14, 38);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    const headers = [
      "N° Référence",
      "Catégorie",
      "Type",
      "Marque",
      "Caractéristiques",
      "État",
      "Montant (Ar)",
      "N° Série",
      "N° IMEI",
      "Date d'acquisition",
      "Région",
      "Responsable",
    ];

    let y = 40;
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
    doc.setDrawColor(0, 170, 255);
    doc.setLineWidth(0.1);
    headers.forEach((header, i) => {
      doc.setFillColor(0, 170, 255);
      doc.rect(
        14 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y,
        columnWidths[i],
        10,
        "FD"
      );
      doc.setTextColor(255, 255, 255);
      doc.text(
        header,
        16 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y + 7
      );
      doc.setTextColor(0);
    });

    y += 10;

    materiels.forEach((materiel) => {
      const rowData = [
        materiel.numero || "",
        materiel.categorie?.nom || "",
        materiel.type?.nom || "",
        materiel.marque || "",
        materiel.caracteristiques || "",
        materiel.etat === "Bon état"
          ? "Bon état"
          : materiel.etat === "État moyen"
          ? "État moyen"
          : materiel.etat === "Mauvais état"
          ? "Mauvais état"
          : "Inconnu",
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
                color = [51, 255, 57];
                break;
              case "État moyen":
                color = [51, 119, 255];
                break;
              case "Mauvais état":
                color = [255, 51, 51];
                break;
              default:
                color = [77, 77, 77];
            }
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...color);
          } else {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0);
          }

          doc.text(
            line,
            16 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
            y + 5 + j * 5
          );
        });
        doc.setDrawColor(51, 187, 255);
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

    doc.save(`Liste des materiels ${selectedRegionName} ${selectedCategoryName}.pdf`);
    setIsLoadPdf(false);
  };

  const exportToExcel = () => {
    setIsLoadExcel(true);
    const ws = XLSX.utils.json_to_sheet(
      materiels.map((materiel) => ({
        ID: materiel.id,
        Nom: materiel.nom,
        Catégorie: materiel.categorie.nom,
        État: materiel.etat,
        Région: materiel.region.nom,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Materiels");
    XLSX.writeFile(wb, "Materiels.xlsx");
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

  const filteredMateriels = materiels.filter((materiel) => {
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

  return (
    <div className="w-[80vw] mx-auto">
      <Entete titre="stocks" description="gérez vos matériels et équipements" />

      <StatsCards
        total={isLoading ? null : materiels.length}
        inGoodCondition={
          isLoading
            ? null
            : materiels.filter(
                (m) => m.etat === "Bon état" || m.etat === "État moyen"
              ).length
        }
        inBadCondition={
          isLoading
            ? null
            : materiels.filter(
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
      />
      {isLoading ? (
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
      ) : materiels.length === 0 ? (
        <Empty titre="Aucun matériel n'a été trouvé" />
      ) : (
        <MaterielsTable
          materiels={showAll ? materiels : filteredMateriels}
          onDelete={handleDelete}
          onEdit={() => setShowAddModal(true)}
        />
      )}
      {(filteredMateriels.length > 0 || (showAll && materiels.length > 0)) && (
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
