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

    // Ajout des logos
    const logoWidth = 30;
    const logoHeight = 30;
    doc.addImage("./images/logo-unic.png", "PNG", 14, 10, logoWidth, logoHeight);
    doc.addImage("./images/logo-unic.png", "PNG", doc.internal.pageSize.width - 44, 10, logoWidth, logoHeight);

    // En-tête avec les informations de l'association
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("ASSOCIATION:", 14, 50);
    doc.setFont("helvetica", "normal");
    doc.text("SAHI", 50, 50);

    doc.setFont("helvetica", "bold");
    doc.text("PROJET:", 14, 57);
    doc.setFont("helvetica", "normal");
    doc.text("SAHI MADIO", 50, 57);

    doc.setFont("helvetica", "bold");
    doc.text("ANNEE:", 14, 64);
    doc.setFont("helvetica", "normal");
    doc.text("2022-2023", 50, 64);

    doc.setFont("helvetica", "bold");
    doc.text("LIEU:", 14, 71);
    doc.setFont("helvetica", "normal");
    doc.text("FORT DAUPHIN", 50, 71);

    doc.setFont("helvetica", "bold");
    doc.text("OBJET:", 14, 78);
    doc.setFont("helvetica", "normal");
    doc.text("INVENTAIRE DE MATERIEL INFORMATIQUE", 50, 78);

    // Titre du tableau
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(173, 216, 230); // Couleur bleu clair
    doc.rect(14, 85, doc.internal.pageSize.width - 28, 10, "F");
    doc.text("INVENTAIRE DE MATERIEL INFORMATIQUE", doc.internal.pageSize.width / 2, 92, { align: "center" });

    // En-tête du tableau
    doc.setFontSize(8);
    const headers = [
      "N°",
      "SOURCE",
      "N° Référence",
      "CARACTERISTIQUES",
      "MARQUE",
      "NUMERO DE SERIE",
      "NUMERO D'IMEI",
      "MONTANT en ARIARY",
      "APPARTE NANCE",
      "DATE ACQUISI TION",
      "DATE DE TRANSFER ERT",
      "LIEU DU AFFECTATION",
      "RESPONSABLE"
    ];

    let y = 100;
    const columnWidths = [10, 20, 25, 25, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    const rowHeight = 10;

    // Style de l'en-tête du tableau
    doc.setFillColor(255, 198, 158); // Couleur saumon clair
    headers.forEach((header, i) => {
      doc.rect(
        14 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y,
        columnWidths[i],
        rowHeight,
        "FD"
      );
      doc.text(
        header,
        14 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + columnWidths[i] / 2,
        y + 7,
        { align: "center" }
      );
    });

    y += rowHeight;

    // Contenu du tableau
    materiels.forEach((materiel, index) => {
      const rowData = [
        (index + 1).toString(),
        materiel.source?.nom || "",
        materiel.numero || "",
        materiel.caracteristiques || "",
        materiel.marque || "",
        materiel.numero_serie || "",
        materiel.numero_imei || "",
        materiel.montant?.toString() || "",
        materiel.appartenance?.nom || "",
        materiel.date_acquisition || "",
        "", // Date de transfert (à ajouter si disponible)
        materiel.region?.nom || "",
        materiel.responsable?.name || "Non assigné"
      ];

      rowData.forEach((text, i) => {
        doc.rect(
          14 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
          y,
          columnWidths[i],
          rowHeight
        );
        doc.text(
          text,
          14 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + columnWidths[i] / 2,
          y + 7,
          { align: "center" }
        );
      });

      y += rowHeight;

      if (y > doc.internal.pageSize.height - 20) {
        doc.addPage("landscape");
        y = 20;
      }
    });

    // Sauvegarde du PDF
    doc.save(`Inventaire_Materiel_Informatique_${new Date().toLocaleDateString()}.pdf`);
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
