import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFilter,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import { MaterielContextProvider, useMateriel } from "@/contexte/useMateriel";
import { useEffect, useState } from "react";
import TitreLabel from "@/composants/TitreLabel";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import Notiflix from "notiflix";
import NProgress from "nprogress";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ButtonExcel from "./ButtonExcel";
import ButtonPdf from "./ButtonPdf";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import logo from "../images/liste-de-controle.png";

function DetailsVehiculeContent() {
  const navigate = useNavigate();
  const {
    oneVehicule,
    getOneUtilisation,
    isLoadingUtilisation,
    updateUtilisation,
    deleteUtilisation,
  } = useMateriel();
  const { id } = useParams();
  const [editingUtilisationId, setEditingUtilisationId] = useState(null);
  const [editedUtilisation, setEditedUtilisation] = useState({});
  const [originalUtilisation, setOriginalUtilisation] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredUtilisations, setFilteredUtilisations] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isLoadPdf, setIsLoadPdf] = useState(false);
  const [isLoadExcel, setIsLoadExcel] = useState(false);

  useEffect(() => {
    getOneUtilisation(id);
  }, [id]);

  useEffect(() => {
    if (oneVehicule?.utilisations) {
      setFilteredUtilisations(oneVehicule.utilisations);
    }
  }, [oneVehicule]);

  const handleFilter = () => {
    if (startDate && endDate) {
      setIsFiltered(true);
      const filtered = oneVehicule.utilisations.filter((utilisation) => {
        const utilisationDate = new Date(utilisation.date);
        return utilisationDate >= startDate && utilisationDate <= endDate;
      });
      setFilteredUtilisations(filtered);
    }
  };

  const handleReset = () => {
    setIsFiltered(false);
    setStartDate(null);
    setEndDate(null);
    setFilteredUtilisations(oneVehicule.utilisations);
  };

  const handleEditUtilisation = (utilisation) => {
    setEditingUtilisationId(utilisation.id);
    setEditedUtilisation({ ...utilisation });
    setOriginalUtilisation({ ...utilisation });
  };

  const handleDeleteUtilisation = (id) => {
    Notiflix.Confirm.show(
      "Confirmation de suppression",
      "Êtes-vous sûr de vouloir supprimer cette utilisation ?",
      "Oui",
      "Non",
      async () => {
        try {
          NProgress.start();
          // TODO: Implement delete functionality
          await deleteUtilisation(id);
        } catch (error) {
          Notiflix.Notify.warning("Erreur lors de la suppression");
        } finally {
          NProgress.done();
        }
      }
    );
  };

  const handleSaveUtilisation = async (id, field, value) => {
    try {
      const newValue = value || editedUtilisation[field];
      const hasChanged =
        newValue !== originalUtilisation[field] &&
        newValue !== null &&
        newValue !== "";

      if (hasChanged) {
        const updateData = { [field]: newValue };

        // Calculate total_km if km_depart or km_arrivee changes
        if (field === "km_depart" || field === "km_arrivee") {
          const km_depart =
            field === "km_depart" ? newValue : editedUtilisation.km_depart;
          const km_arrivee =
            field === "km_arrivee" ? newValue : editedUtilisation.km_arrivee;
          if (km_depart && km_arrivee) {
            updateData.total_km = km_arrivee - km_depart;
          }
        }

        // Calculate montant if pu_ariary or qtt_litre changes
        if (field === "pu_ariary" || field === "qtt_litre") {
          const pu_ariary =
            field === "pu_ariary" ? newValue : editedUtilisation.pu_ariary;
          const qtt_litre =
            field === "qtt_litre" ? newValue : editedUtilisation.qtt_litre;
          if (pu_ariary && qtt_litre) {
            updateData.montant = pu_ariary * qtt_litre;
          }
        }

        // TODO: Implement update functionality
        await updateUtilisation(id, updateData);
        setOriginalUtilisation((prev) => ({
          ...prev,
          [field]: editedUtilisation[field],
          ...(updateData.total_km && { total_km: updateData.total_km }),
          ...(updateData.montant && { montant: updateData.montant }),
        }));
      }
    } catch (error) {
      Notiflix.Notify.warning("Erreur lors de la mise à jour");
      setEditedUtilisation((prev) => ({
        ...prev,
        [field]: originalUtilisation[field],
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUtilisation((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
    doc.text(`VEHICULE: ${oneVehicule?.type?.nom} ${oneVehicule?.caracteristiques || ""}`, 20, 90);
    doc.text("OBJET: DETAILS DES UTILISATIONS", 20, 100);

    // Ajouter les dates de filtrage si elles existent
    if (isFiltered && startDate && endDate) {
      doc.text(`PERIODE: Du ${startDate.toLocaleDateString()} au ${endDate.toLocaleDateString()}`, 20, 110);
      // Décaler le tableau vers le bas
      y = 120;
    }

    // Ajouter le tableau des utilisations
    const headers = [
      "Date", "Chef missionnaire", "Lieu", "Activité", "Carburant",
      "Immatriculation", "Km départ", "Km arrivée", "Total Km",
      "Qté litre", "PU (Ar)", "Montant (Ariary)"
    ];

    let y = 110;
    const columnWidths = [25, 30, 25, 25, 20, 25, 20, 20, 20, 20, 20, 25];
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
      doc.rect(14 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, columnWidths[i], 10, "FD");
      doc.setTextColor(75, 85, 99);
      doc.text(header, 16 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y + 7);
    });

    y += 10;

    filteredUtilisations.forEach((utilisation) => {
      const rowData = [
        utilisation.date || "",
        utilisation.chef_missionnaire || "",
        utilisation.lieu || "",
        utilisation.activite || "",
        utilisation.carburant || "",
        utilisation.immatriculation || "",
        utilisation.km_depart?.toString() || "",
        utilisation.km_arrivee?.toString() || "",
        utilisation.total_km?.toString() || "",
        utilisation.qtt_litre?.toString() || "",
        utilisation.pu_ariary?.toString() || "",
        utilisation.montant?.toString() || ""
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

    doc.save(`Utilisations ${oneVehicule?.type?.nom} ${new Date().getFullYear()}.pdf`);
    setIsLoadPdf(false);
  };

  const exportToExcel = () => {
    setIsLoadExcel(true);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);

    // Préparer les en-têtes avec ou sans dates de filtrage
    const headers = [
      ["Sehatra Amparihasombintsika Hoan'ny Iom-panitra"],
      ["BP 806 Diego Suarez | Email: sahieahi@gmail.com | Web: sahieassociation.org"],
      ["Tel: +261 32 04 765 02 / +261 34 20 9420 765 04"],
      [""],
      ["ASSOCIATION: SAHI"],
      ["PROJET: SAHI MADIO"],
      [`ANNEE: ${new Date().getFullYear()}`],
      [`VEHICULE: ${oneVehicule?.type?.nom} ${oneVehicule?.caracteristiques || ""}`],
      ["OBJET: DETAILS DES UTILISATIONS"],
    ];

    // Ajouter les dates de filtrage si elles existent
    if (isFiltered && startDate && endDate) {
      headers.push([`PERIODE: Du ${startDate.toLocaleDateString()} au ${endDate.toLocaleDateString()}`]);
    }
    headers.push([""]); // Ligne vide avant le tableau

    XLSX.utils.sheet_add_aoa(ws, headers, { origin: "A1" });

    // Style pour les en-têtes
    for (let i = 1; i <= headers.length; i++) {
      ws[`A${i}`].s = {
        font: { bold: true, color: { rgb: "4B5563" } },
        alignment: { horizontal: "left" }
      };
    }

    // Ajouter les en-têtes du tableau
    const tableHeaders = [
      "Date", "Chef missionnaire", "Lieu", "Activité", "Carburant",
      "Immatriculation", "Km départ", "Km arrivée", "Total Km",
      "Qté litre", "PU (Ar)", "Montant (Ariary)"
    ];

    // Ajuster l'origine du tableau en fonction du nombre d'en-têtes
    const tableStartRow = headers.length + 1;
    XLSX.utils.sheet_add_aoa(ws, [tableHeaders], { origin: `A${tableStartRow}` });

    // Style pour les en-têtes du tableau
    for (let i = 0; i < tableHeaders.length; i++) {
      const cell = XLSX.utils.encode_cell({ r: tableStartRow - 1, c: i });
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
    const data = filteredUtilisations.map(utilisation => [
      utilisation.date || "",
      utilisation.chef_missionnaire || "",
      utilisation.lieu || "",
      utilisation.activite || "",
      utilisation.carburant || "",
      utilisation.immatriculation || "",
      utilisation.km_depart || "",
      utilisation.km_arrivee || "",
      utilisation.total_km || "",
      utilisation.qtt_litre || "",
      utilisation.pu_ariary || "",
      utilisation.montant || ""
    ]);

    XLSX.utils.sheet_add_aoa(ws, data, { origin: `A${tableStartRow + 1}` });

    // Style pour les données
    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellRef = XLSX.utils.encode_cell({ r: rowIndex + tableStartRow, c: colIndex });
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
      { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 },
      { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 20 }
    ];
    ws['!cols'] = wscols;

    // Ajouter la date d'exportation
    const exportDate = new Date().toLocaleString();
    const lastRow = data.length + tableStartRow + 1;
    XLSX.utils.sheet_add_aoa(ws, [[`Exporté le: ${exportDate}`]], { origin: `A${lastRow + 1}` });
    ws[`A${lastRow + 1}`].s = { font: { color: { rgb: "4B5563" } } };

    XLSX.utils.book_append_sheet(wb, ws, "Utilisations");
    XLSX.writeFile(wb, `Utilisations ${oneVehicule?.type?.nom} ${new Date().getFullYear()}.xlsx`);
    setIsLoadExcel(false);
  };

  return (
    <div className="w-[80vw] mx-auto my-10">
      <button
        className=" border-2 cursor-pointer border-blue-500  flex items-center gap-2 text-blue-500 font-bold px-4 py-2 rounded-3xl"
        onClick={() => navigate("/gestion-de-vehicule")}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Retour
      </button>
      <div className="text-2xl flex gap-2 items-center font-bold text-gray-700 my-4">
        <p>Détails sur les utilisations de :</p>
        {isLoadingUtilisation ? (
          <div className="h-6 bg-gray-200 w-20 rounded animate-pulse"></div>
        ) : (
          <div className="flex gap-2 items-center">
            <p className="uppercase text-gray-400">{oneVehicule?.type?.nom}</p>
            <b className="text-sm">
              {oneVehicule?.caracteristiques
                ? `- ${oneVehicule?.caracteristiques}`
                : ""}
            </b>
          </div>
        )}
      </div>
      <div className="flex justify-center gap-4 py-2">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Date de début"
          className="p-2 focus:outline-none text-gray-700 text-center cursor-pointer rounded font-bold ring"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Date de fin"
          className="p-2 focus:outline-none text-gray-700 text-center cursor-pointer rounded font-bold ring"
        />
      </div>
      <div className="flex justify-center gap-4 py-2">
        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!startDate || !endDate}
        >
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          Filtrer
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer"
        >
          <FontAwesomeIcon icon={faExchangeAlt} className="mr-2" />
          Réinitialiser
        </button>
      </div>
      <div className="mt-4 overflow-x-auto border border-gray-200 rounded max-h-[500px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 whitespace-nowrap">
            <tr>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Date" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Chef missionnaire" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Lieu" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Activité" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Carburant" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Immatriculation" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Km départ" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Km arrivée" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Total Km" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Qté litre" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="PU (Ar)" />
              </th>
              <th className="px-6 py-4 text-left min-w-[150px]">
                <TitreLabel titre="Montant (Ariary)" />
              </th>
              <th className="px-4 py-3 text-center">
                <TitreLabel titre="Actions" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoadingUtilisation ? (
              <tr>
                <td colSpan="13" className="px-6 py-4 px-10">
                  <div className="h-6 bg-gray-200 w-full rounded animate-pulse"></div>
                </td>
              </tr>
            ) : !filteredUtilisations?.length ? (
              <tr>
                <td
                  colSpan="13"
                  className="px-6 py-4 text-center text-gray-500"
                >
                  Aucune utilisation enregistrée
                </td>
              </tr>
            ) : (
              filteredUtilisations.map((utilisation) => (
                <tr key={utilisation.id}>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {utilisation.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {utilisation.chef_missionnaire}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="text"
                        value={editedUtilisation.lieu || ""}
                        onChange={(e) =>
                          handleInputChange("lieu", e.target.value)
                        }
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() =>
                          handleSaveUtilisation(utilisation.id, "lieu")
                        }
                      />
                    ) : (
                      utilisation.lieu
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="text"
                        value={editedUtilisation.activite || ""}
                        onChange={(e) =>
                          handleInputChange("activite", e.target.value)
                        }
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() =>
                          handleSaveUtilisation(utilisation.id, "activite")
                        }
                      />
                    ) : (
                      utilisation.activite
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="text"
                        value={editedUtilisation.carburant || ""}
                        onChange={(e) =>
                          handleInputChange("carburant", e.target.value)
                        }
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() =>
                          handleSaveUtilisation(utilisation.id, "carburant")
                        }
                      />
                    ) : (
                      utilisation.carburant
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="text"
                        value={editedUtilisation.immatriculation || ""}
                        onChange={(e) =>
                          handleInputChange("immatriculation", e.target.value)
                        }
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() =>
                          handleSaveUtilisation(
                            utilisation.id,
                            "immatriculation"
                          )
                        }
                      />
                    ) : (
                      utilisation.immatriculation
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="number"
                        value={editedUtilisation.km_depart || ""}
                        onChange={(e) =>
                          handleInputChange("km_depart", e.target.value)
                        }
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() =>
                          handleSaveUtilisation(utilisation.id, "km_depart")
                        }
                      />
                    ) : (
                      utilisation.km_depart
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="number"
                        value={editedUtilisation.km_arrivee || ""}
                        onChange={(e) =>
                          handleInputChange("km_arrivee", e.target.value)
                        }
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() =>
                          handleSaveUtilisation(utilisation.id, "km_arrivee")
                        }
                      />
                    ) : (
                      utilisation.km_arrivee
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {utilisation.total_km}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="number"
                        value={editedUtilisation.qtt_litre || ""}
                        onChange={(e) =>
                          handleInputChange("qtt_litre", e.target.value)
                        }
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() =>
                          handleSaveUtilisation(utilisation.id, "qtt_litre")
                        }
                      />
                    ) : (
                      utilisation.qtt_litre
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {editingUtilisationId === utilisation.id ? (
                      <input
                        type="number"
                        value={editedUtilisation.pu_ariary || ""}
                        onChange={(e) =>
                          handleInputChange("pu_ariary", e.target.value)
                        }
                        className="p-2 text-black flex-grow border rounded w-full"
                        onBlur={() =>
                          handleSaveUtilisation(utilisation.id, "pu_ariary")
                        }
                      />
                    ) : (
                      utilisation.pu_ariary
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 truncate min-w-[150px]">
                    {utilisation.montant}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2 justify-center">
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-red-500 bg-red-200 p-2 rounded-full cursor-pointer"
                        onClick={() => handleDeleteUtilisation(utilisation.id)}
                      />
                      {editingUtilisationId !== utilisation.id && (
                        <FontAwesomeIcon
                          icon={faPen}
                          className="text-blue-500 bg-blue-200 p-2 rounded-full cursor-pointer"
                          onClick={() => handleEditUtilisation(utilisation)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filteredUtilisations.length > 0 && (
        <div className="flex justify-end mt-4 gap-2">
          <ButtonExcel isLoading={isLoadExcel} onClick={exportToExcel} />
          <ButtonPdf isLoading={isLoadPdf} onClick={exportToPDF} />
        </div>
      )}
    </div>
  );
}

export default function DetailsVehicule() {
  return (
    <MaterielContextProvider>
      <DetailsVehiculeContent />
    </MaterielContextProvider>
  );
}
