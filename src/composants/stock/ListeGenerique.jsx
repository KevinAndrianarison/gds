import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Button } from "@/components/ui/button";
import {
  faTrash,
  faPen,
  faTrashCan,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Empty from "../Empty";
import { notify } from "@/utils/notify";
import { Input } from "@/components/ui/input";
import InputSearch from "@/composants/InputSearch";

export default function ListeGenerique({
  items = [],
  onAdd,
  onDelete,
  onEdit,
  onMultipleDelete,
  isLoading = false,
  itemName = "élément",
  searchTerm = "",
  nameField = "nom", // champ à utiliser pour le nom de l'élément
  ExtraField = null, // composant supplémentaire à afficher dans le formulaire
}) {
  const [editingId, setEditingId] = useState(null);
  const [editedItems, setEditedItems] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [newItemValue, setNewItemValue] = useState("");
  const [searchValue, setSearchValue] = useState(searchTerm);
  const [isAdding, setIsAdding] = useState(false);
  const [isVehicule, setIsVehicule] = useState(false);

  useEffect(() => {
    setSearchValue(searchTerm);
  }, [searchTerm]);

  const filteredItems = items.filter((item) =>
    item[nameField].toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };


  const handleDeleteSelectedItems = async () => {
    if (selectedItems.length === 0) return;

    try {
      NProgress.start();
      await onMultipleDelete(selectedItems);
      notify.success(
        selectedItems.length + " " + itemName + "(s) supprimé(s) avec succès"
      );
      setSelectedItems([]);
    } catch (error) {
      notify.error(error);
    } finally {
      NProgress.done();
    }
  };

  const handleEditItem = (itemId) => {
    setEditingId(itemId);
    const itemToEdit = items.find((i) => i.id === itemId);
    setEditedItems((prev) => ({
      ...prev,
      [itemId]: itemToEdit[nameField],
    }));
  };

  const handleSaveItem = async (itemId) => {
    const originalItem = items.find((item) => item.id === itemId);
    const newName = editedItems[itemId];

    // Ne faire la requête que si le nom a changé
    if (newName === originalItem[nameField]) {
      setEditingId(null);
      return;
    }

    try {
      NProgress.start();
      await onEdit(itemId, { [nameField]: newName });
      notify.success(itemName + " mis à jour avec succès");
      setEditingId(null);
    } catch (error) {
      notify.error(error);
    } finally {
      NProgress.done();
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      NProgress.start();
      await onDelete(itemId);
      notify.success(itemName + " supprimé avec succès");
    } catch (error) {
      notify.error(error);
    } finally {
      NProgress.done();
    }
  };

  const handleAddItem = async () => {
    if (newItemValue.trim()) {
      try {
        setIsAdding(true);
        NProgress.start();
        const result = await onAdd({ [nameField]: newItemValue.trim(), isVehicule: isVehicule });
        if (result) {
          // Ne réinitialiser que si l'ajout a réussi
          setNewItemValue("");
        }
      } catch (error) {
        // Ne rien faire en cas d'erreur, garder les valeurs
      } finally {
        setIsAdding(false);
        NProgress.done();
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <div className="flex-grow items-end flex gap-2">
          <Input
            type="text"
            value={newItemValue}
            onChange={(e) => setNewItemValue(e.target.value)}
            placeholder={`Nouveau ${itemName}`}
            className="flex-grow"
          />
      
          {ExtraField && <div className="w-64">{ExtraField}</div>}
        </div>
        <Button
          onClick={handleAddItem}
          variant="add"
          className="rounded-xl"
          disabled={!newItemValue.trim() || isAdding}
        >
          {isAdding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FontAwesomeIcon icon={faPlus} />
          )}
        </Button>
      </div>
      {itemName === "catégorie" && (
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={isVehicule} className="cursor-pointer" onChange={() => setIsVehicule(!isVehicule)} />
          <p className="text-sm"> C'est un véhicule</p>
        </div>
      )}
      {items.length > 0 && (
        <InputSearch
          width="w-full"
          value={searchValue}
          onChange={setSearchValue}
        />
      )}
      <div className="flex justify-between items-center">
        <h1 className="uppercase text-xs font-bold mt-2">
          Liste des {itemName}s
        </h1>
        {selectedItems.length > 0 && (
          <div
            className="flex items-center gap-2 text-white bg-red-400 rounded-full px-4 py-1 cursor-pointer"
            onClick={handleDeleteSelectedItems}
          >
            <FontAwesomeIcon icon={faTrashCan} />
            <span className="text-sm">
              Supprimer {selectedItems.length} {itemName}(s)
            </span>
          </div>
        )}
      </div>

      {!isLoading && filteredItems.length !== 0 && (
        <div className="bg-gray-50 text-sm max-h-[50vh] overflow-y-auto rounded px-4 flex flex-col gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex py-1 justify-between items-center w-full"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                />
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editedItems[item.id] || ""}
                    onChange={(e) =>
                      setEditedItems((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    className="p-2 text-black flex-grow border rounded"
                    onBlur={() => handleSaveItem(item.id)}
                    autoFocus
                  />
                ) : (
                  <input
                    type="text"
                    value={item[nameField]}
                    className="p-2 text-black flex-grow"
                    readOnly
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-red-500 bg-red-200 p-1.5 rounded-full cursor-pointer"
                  onClick={() => handleDeleteItem(item.id)}
                />
                {editingId !== item.id && (
                  <FontAwesomeIcon
                    icon={faPen}
                    className="text-blue-500 bg-blue-200 p-1.5 rounded-full cursor-pointer"
                    onClick={() => handleEditItem(item.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="animate-pulse space-y-4 mt-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      )}

      {!isLoading && filteredItems.length === 0 && (
        <Empty titre={`Aucun ${itemName} n'a été trouvé`} />
      )}
    </div>
  );
}
