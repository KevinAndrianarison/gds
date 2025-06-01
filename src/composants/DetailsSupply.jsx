import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { SupplyContext } from "../contexte/useSupply";
import axios from "axios";
import { UrlContext } from "../contexte/useUrl";
import nProgress from "nprogress";
import Notiflix from "notiflix";
import { useState } from "react";
import TitreLabel from "./TitreLabel";
import ButtonPdf from "./ButtonPdf";
import ButtonExcel from "./ButtonExcel";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import logo from "../images/liste-de-controle.png";

export default function DetailsSupply({ supply }) {
  const { getAllSupply, getSupplyParIdRegion } = useContext(SupplyContext);
  const { url } = useContext(UrlContext);
  const [editingDetailId, setEditingDetailId] = useState(null);
  const [editedDetail, setEditedDetail] = useState({});
  const [originalDetail, setOriginalDetail] = useState({});
  const [isLoadPdf, setIsLoadPdf] = useState(false);
  const [isLoadExcel, setIsLoadExcel] = useState(false);

  const handleInputChange = (field, value) => {
    setEditedDetail((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDetail = async (id, field, value) => {
    let token = localStorage.getItem('token');
    try {
      const newValue = value || editedDetail[field];
      const hasChanged =
        newValue !== originalDetail[field] && newValue !== null && newValue !== '';

      if (hasChanged) {
        nProgress.start();
        try {
          await axios.put(`${url}/api/details-supplies/${id}`, { [field]: newValue, supply_id: supply.id }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          let region = JSON.parse(localStorage.getItem("region"));
          if (region) {
            getSupplyParIdRegion(region.id);
          } else {
            getAllSupply();
          }
          Notiflix.Notify.success("Détail modifié avec succès");
        } catch (error) {
          console.error(error);
          Notiflix.Notify.failure("Erreur lors de la modification");
        } finally {
          nProgress.done();
        }
      }
    } catch (error) {
      console.error(error);
      Notiflix.Notify.failure("Erreur lors de la modification");
    } finally {
      nProgress.done();
    }
  };

  const handleDeleteDetail = (id) => {
    let token = localStorage.getItem('token');
    nProgress.start();
    axios
      .delete(`${url}/api/details-supplies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        let region = JSON.parse(localStorage.getItem("region"));
        if (region) {
          getSupplyParIdRegion(region.id);
        } else {
          getAllSupply();
        }
        nProgress.done();
        Notiflix.Notify.success("Détail supprimé avec succès");
      })
      .catch((err) => {
        console.error(err);
        nProgress.done();
        Notiflix.Notify.failure(
          err.response.data.message || " Erreur lors de la suppression"
        );
      });
  };

  const handleEditDetail = (detail) => {
    setEditingDetailId(detail.id);
    setEditedDetail({ ...detail });
    setOriginalDetail({ ...detail });
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
    doc.text(`MATERIEL: ${supply.nom}`, 20, 90);
    doc.text("OBJET: DETAILS DES ENTREES/SORTIES", 20, 100);

    // Ajouter le tableau des détails
    const headers = [
      "Rubrique", "Lieu", "Transporteur", "Réceptionnaire", "Numéros B.E",
      "Observations", "E/S", "Date"
    ];

    let y = 110;
    const columnWidths = [30, 25, 30, 30, 25, 35, 15, 25];
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

    supply.details_supply.forEach((detail) => {
      const rowData = [
        detail.rubrique || "",
        detail.lieu_destination || "",
        detail.transporteur || "",
        detail.receptionnaire || "",
        detail.numero_be || "",
        detail.observation || "",
        detail.entree || detail.sortie || "",
        detail.date || ""
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
          if (i === 6) { // Pour la colonne E/S
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...(detail.entree ? [34, 197, 94] : [248, 113, 113]));
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

    doc.save(`Details des mouvements ${supply.nom} ${new Date().getFullYear()}.pdf`);
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
      [`MATERIEL: ${supply.nom}`],
      ["OBJET: DETAILS DES ENTREES/SORTIES"],
      [""]
    ], { origin: "A1" });

    // Style pour les en-têtes
    for (let i = 1; i <= 9; i++) {
      ws[`A${i}`].s = {
        font: { bold: true, color: { rgb: "4B5563" } },
        alignment: { horizontal: "left" }
      };
    }

    // Ajouter les en-têtes du tableau
    const headers = [
      "Rubrique", "Lieu", "Transporteur", "Réceptionnaire", "Numéros B.E",
      "Observations", "E/S", "Date"
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
          right: { style: "thin", color: { rgb: "E5E7EB" } }
        }
      };
    }

    // Ajouter les données
    const data = supply.details_supply.map(detail => [
      detail.rubrique || "",
      detail.lieu_destination || "",
      detail.transporteur || "",
      detail.receptionnaire || "",
      detail.numero_be || "",
      detail.observation || "",
      detail.entree || detail.sortie || "",
      detail.date || ""
    ]);

    XLSX.utils.sheet_add_aoa(ws, data, { origin: "A12" });

    // Style pour les données
    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 11, c: colIndex });
        ws[cellRef].s = {
          font: { color: { rgb: "111827" } },
          border: {
            top: { style: "thin", color: { rgb: "E5E7EB" } },
            bottom: { style: "thin", color: { rgb: "E5E7EB" } },
            left: { style: "thin", color: { rgb: "E5E7EB" } },
            right: { style: "thin", color: { rgb: "E5E7EB" } }
          }
        };

        // Style spécial pour la colonne "E/S"
        if (colIndex === 6) {
          const isEntree = row[colIndex] === "E";
          ws[cellRef].s.font = {
            bold: true,
            color: { rgb: isEntree ? "22C55E" : "F87171" }
          };
        }
      });
    });

    // Ajuster la largeur des colonnes
    const wscols = [
      { wch: 25 }, { wch: 20 }, { wch: 25 }, { wch: 25 }, { wch: 20 },
      { wch: 30 }, { wch: 10 }, { wch: 20 }
    ];
    ws['!cols'] = wscols;

    // Ajouter la date d'exportation
    const exportDate = new Date().toLocaleString();
    const lastRow = data.length + 12;
    XLSX.utils.sheet_add_aoa(ws, [[`Exporté le: ${exportDate}`]], { origin: `A${lastRow + 1}` });
    ws[`A${lastRow + 1}`].s = { font: { color: { rgb: "4B5563" } } };

    XLSX.utils.book_append_sheet(wb, ws, "Details");
    XLSX.writeFile(wb, `Details des mouvements ${supply.nom} ${new Date().getFullYear()}.xlsx`);
    setIsLoadExcel(false);
  };

  return (
    <div>
      <h1 className="text-lg">
        <b className="text-gray-700">Entrer - Sortie</b>
      </h1>
      <p className="flex items-center text-xs font-bold gap-2 text-gray-500">
        <FontAwesomeIcon icon={faThumbTack} className="text-yellow-500" />{" "}
        {supply.nom}
      </p>
      <div className="mt-4 text-sm border rounded-sm">
        <div className="flex gap-2 bg-gray-100 py-2 rounded-t-sm">
          <div className="w-[14%] px-4"><TitreLabel titre="Rubrique" /></div>
          <div className="w-[10%]"><TitreLabel titre="Lieu" /></div>
          <div className="w-[14%]"><TitreLabel titre="Transporteur" /></div>
          <div className="w-[14%]"><TitreLabel titre="Réceptionnaire" /></div>
          <div className="w-[10%]"><TitreLabel titre="Numeros B.E" /></div>
          <div className="w-[14%]"><TitreLabel titre="Observations" /></div>
          <div className="w-[5%]"><TitreLabel titre="E/S" /></div>
          <div className="w-[10%]"><TitreLabel titre="Date" /></div>
          <div className="w-[9%] text-center"><TitreLabel titre="Actions" /></div>
        </div>
        <div className="max-h-80 overflow-y-auto border-t">
          {supply.details_supply.map((detail) => (
            <div key={detail.id} className="flex gap-2 py-2">
              <h1 className="w-[14%] truncate px-4">
                {editingDetailId === detail.id ? (
                  <input
                    type="text"
                    value={editedDetail.rubrique}
                    onChange={(e) => {
                      handleInputChange("rubrique", e.target.value);
                      handleSaveDetail(detail.id, "rubrique", e.target.value);
                    }}
                    className="p-2 text-black flex-grow border rounded w-full"
                  />
                ) : (
                  detail?.rubrique
                )}
              </h1>
              <h1 className="w-[10%] truncate">
                {editingDetailId === detail.id ? (
                  <input
                    type="text"
                    value={editedDetail.lieu_destination}
                    onChange={(e) =>
                      handleInputChange("lieu_destination", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveDetail(detail.id, "lieu_destination")}
                    autoFocus
                  />
                ) : (
                  detail?.lieu_destination
                )}
              </h1>
              <h1 className="w-[14%] truncate">
                {editingDetailId === detail.id ? (
                  <input
                    type="text"
                    value={editedDetail.transporteur}
                    onChange={(e) =>
                      handleInputChange("transporteur", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveDetail(detail.id, "transporteur")}
                    autoFocus
                  />
                ) : (
                  detail?.transporteur
                )}
              </h1>
              <h1 className="w-[14%] truncate">
                {editingDetailId === detail.id ? (
                  <input
                    type="text"
                    value={editedDetail.receptionnaire}
                    onChange={(e) =>
                      handleInputChange("receptionnaire", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveDetail(detail.id, "receptionnaire")}
                    autoFocus
                  />
                ) : (
                  detail?.receptionnaire
                )}
              </h1>
              <h1 className="w-[10%] truncate">
                {editingDetailId === detail.id ? (
                  <input
                    type="text"
                    value={editedDetail.numero_be}
                    onChange={(e) =>
                      handleInputChange("numero_be", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveDetail(detail.id, "numero_be")}
                    autoFocus
                  />
                ) : (
                  detail?.numero_be
                )}
              </h1>
              <h1 className="w-[14%] truncate">
                {editingDetailId === detail.id ? (
                  <input
                    type="text"
                    value={editedDetail.observation}
                    onChange={(e) =>
                      handleInputChange("observation", e.target.value)
                    }
                    className="p-2 text-black flex-grow border rounded w-full"
                    onBlur={() => handleSaveDetail(detail.id, "observation")}
                    autoFocus
                  />
                ) : (
                  detail?.observation
                )}
              </h1>
              <h1
                className={`w-[5%] truncate font-bold ${detail?.entree ? "text-green-500" : "text-red-500"
                  }`}
              >
                {detail?.entree || detail?.sortie}
              </h1>
              <h1 className="w-[10%] truncate">
                {editingDetailId === detail.id ? (
                  <input
                    type="date"
                    value={editedDetail.date}
                    onChange={(e) => {
                      handleInputChange("date", e.target.value);
                      handleSaveDetail(detail.id, "date", e.target.value);
                    }}
                    className="p-2 text-black flex-grow border rounded w-full"
                  />
                ) : (
                  detail?.date
                )}
              </h1>
              <div className="w-[9%] flex gap-1 justify-center">
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => handleDeleteDetail(detail.id)}
                  className="text-red-500 border-2 text-xs border-red-500 cursor-pointer rounded-full p-1"
                />
                {(editingDetailId !== detail.id ||
                  editedDetail.id === null) && (
                    <FontAwesomeIcon
                      icon={faPen}
                      onClick={() => handleEditDetail(detail)}
                      className="text-yellow-500 border-2 text-xs border-yellow-500 cursor-pointer rounded-full p-1"
                    />
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 text-sm mt-4">
        <ButtonPdf isLoading={isLoadPdf} onClick={exportToPDF} />
        <ButtonExcel isLoading={isLoadExcel} onClick={exportToExcel} />
      </div>
    </div>
  );
}
