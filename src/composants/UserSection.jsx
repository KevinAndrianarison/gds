import React, { useContext, useState, useEffect } from "react";
import {
  faGear,
  faRightFromBracket,
  faBars,
  faXmark,
  faGlobe,
  faUsers,
  faCircleUser,
  faScrewdriverWrench,
  faComputer,
  faFolderTree,
  faLocationDot,
  faClockRotateLeft
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import Notiflix from "notiflix";
import { ShowContext } from "@/contexte/useShow";
import { AuthContext } from "@/contexte/AuthContext";
import { UrlContext } from "@/contexte/useUrl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideMenuLink from "./SideMenuLink";

export default function UserSection({ toggleMenu, isOpen }) {
  const navigate = useNavigate();
  const { setIsConnexion, setIsLogin, setIsDash, isAdmin } =
    useContext(ShowContext);
  const { user, logout: authLogout, checkAuth } = useContext(AuthContext);

  // Recharger les données du user une seule fois au montage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkAuth();
    }
  }, []); // Dépendances vides pour n'exécuter qu'au montage
  const { url } = useContext(UrlContext);
  const [sheetOpen, setSheetOpen] = useState(false);

  function goProfil() {
    navigate("/profil");
  }

  function handleLogout() {
    Notiflix.Confirm.show(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      "Oui",
      "Non",
      async () => {
        await authLogout();
        setIsDash(false);
        setIsConnexion(true);
        setIsLogin(true);
      },
      () => { }
    );
  }

  return (
    <div className="flex flex-wrap gap-10 justify-end">
      <div
        onClick={goProfil}
        className="flex items-center space-x-2 cursor-pointer"
      >
        {user?.photo_url ? (
          <img
            src={`${url}/storage/${user.photo_url}`}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="logoUtilisateur h-10 w-10 rounded-full"></div>
        )}
        <div>
          <span className="font-medium">{user?.name || "Utilisateur"}</span>
          {JSON.parse(localStorage.getItem("region"))?.nom && (
            <p className="text-sm text-gray-500 text-right">
              <FontAwesomeIcon icon={faLocationDot} className="text-red-500 uppercase" /> {JSON.parse(localStorage.getItem("region"))?.nom}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-800 text-xl">
            <FontAwesomeIcon
              icon={isOpen ? faXmark : faBars}
              className={
                isOpen
                  ? "max-md:text-gray-500 max-md:bg-gray-200 max-md:rounded-full max-md:py-0.5 max-md:px-1"
                  : ""
              }
            />
          </button>
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            {isAdmin && (
              <button className="cursor-pointer focus:outline-none">
                <FontAwesomeIcon icon={faGear} className="text-xl" />
              </button>
            )}
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <div className=" flex justify-center items-center">
                  <div className="logoLogin h-20 w-40"></div>
                </div>
                <p className="flex items-center gap-2 text-xs py-2">
                  <FontAwesomeIcon icon={faFolderTree} /> GESTION DES{" "}
                </p>
                <div className="mt-2 font-light text-md flex flex-col gap-1">
                  <SideMenuLink
                    to="/regions"
                    icon={faGlobe}
                    onClick={() => setSheetOpen(false)}
                  >
                    Régions
                  </SideMenuLink>
                  <SideMenuLink
                    to="/utilisateurs"
                    icon={faUsers}
                    onClick={() => setSheetOpen(false)}
                  >
                    Utilisateurs
                  </SideMenuLink>
                </div>
                <p className="mt-4 flex items-center gap-2 text-xs py-2">
                  <FontAwesomeIcon icon={faScrewdriverWrench} /> CONFIGURATION{" "}
                </p>
                <div className="mt-2 font-light text-md flex flex-col gap-1">
                  <SideMenuLink
                    to="/profil"
                    icon={faCircleUser}
                    onClick={() => setSheetOpen(false)}
                  >
                    Profil
                  </SideMenuLink>
                  <SideMenuLink
                    to="/historiques"
                    icon={faClockRotateLeft}
                    onClick={() => setSheetOpen(false)}
                  >
                    Historiques
                  </SideMenuLink>
                </div>
              </SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <button
          onClick={handleLogout}
          className="cursor-pointer focus:outline-none"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="text-xl" />
        </button>
      </div>
    </div>
  );
}
