import React, { useState, useEffect, useContext } from "react";
import TitreLabel from "@/composants/TitreLabel";
import InputOn from "@/composants/InputOn";
import ButtonAdd from "@/composants/ButtonAdd";
import { UrlContext } from "@/contexte/useUrl";
import { AuthContext } from "@/contexte/AuthContext";
import axios from "axios";
import nProgress from "nprogress";
import { Notify } from "notiflix";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";

export default function Profil() {
  const { url } = useContext(UrlContext);
  const { user: authUser, setUser } = useContext(AuthContext);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    numeros: "",
    photo_url: null,
  });
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Notify.failure("Veuillez vous connecter");
      return;
    }

    try {
      nProgress.start();
      const response = await axios.get(`${url}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data.user;
      setUserData(user);
      if (user.photo_url) {
        setPhotoPreview(`${url}/storage/${user.photo_url}`);
      }
    } catch (error) {
      Notify.failure("Erreur lors du chargement des données");
    } finally {
      nProgress.done();
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("photo", file);

      try {
        nProgress.start();
        const response = await axios.post(`${url}/api/update-photo`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const userResponse = await axios.get(`${url}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const updatedUser = userResponse.data.user;
        setUserData((prev) => ({
          ...prev,
          photo_url: updatedUser.photo_url,
        }));

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setPhotoPreview(
          updatedUser.photo_url
            ? `${url}/storage/${updatedUser.photo_url}`
            : null
        );
        setPhoto(null);
        Notify.success("Photo de profil mise à jour");
      } catch (error) {
        Notify.failure("Erreur lors de la mise à jour de la photo");
        setPhotoPreview(
          userData.photo_url ? `${url}/storage/${userData.photo_url}` : null
        );
      } finally {
        nProgress.done();
      }
    }
  };

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputBlur = async (field) => {
    if (!isEditingProfile) return;

    const originalValue = JSON.parse(localStorage.getItem("user"))[field];
    const currentValue = userData[field];

    if (originalValue === currentValue) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      nProgress.start();
      const response = await axios.put(
        `${url}/api/update-user`,
        {
          field,
          value: userData[field],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userResponse = await axios.get(`${url}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = userResponse.data.user;

      setUserData(updatedUser);
      if (updatedUser.photo_url) {
        setPhotoPreview(`${url}/storage/${updatedUser.photo_url}`);
      }
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      Notify.success("Profil mis à jour");
    } catch (error) {
      console.error("Erreur:", error);
      Notify.failure(
        error.response?.data?.message || "Erreur lors de la mise à jour"
      );
    } finally {
      nProgress.done();
    }
  };

  const handlePasswordSubmit = async () => {
    if (
      !passwords.current_password ||
      !passwords.new_password ||
      !passwords.confirm_password
    ) {
      Notify.warning("Veuillez remplir tous les champs");
      return;
    }

    if (passwords.new_password !== passwords.confirm_password) {
      Notify.warning("Les mots de passe ne correspondent pas");
      return;
    }
    if (passwords.new_password.length < 6) {
      Notify.warning("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Notify.warning("Veuillez vous connecter");
        return;
      }

      setIsLoading(true);
      nProgress.start();
      await axios.put(`${url}/api/update-password`, passwords, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Notify.success("Mot de passe mis à jour");
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setIsChangingPassword(false);
    } catch (error) {
      console.error("Erreur:", error);
      Notify.failure(
        error.response?.data?.message || "Erreur lors de la mise à jour"
      );
    } finally {
      setIsLoading(false);
      nProgress.done();
    }
  };

  const togglePasswordChange = () => {
    if (isChangingPassword) {
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    }
    setIsChangingPassword(!isChangingPassword);
  };

  return (
    <div className="p-2 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-6">
        <div className="relative">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt={userData.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center">
              <span className="text-4xl text-blue-300">
                {userData.name
                  ? userData.name.substring(0, 2).toUpperCase()
                  : ""}
              </span>
            </div>
          )}
          <label
            htmlFor="photo-input"
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
          </label>
          <input
            type="file"
            id="photo-input"
            className="hidden"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{userData.name}</h2>
          <p className="text-gray-600">{userData.email}</p>
          <div
            className={
              userData.role === "admin"
                ? "w-32 text-gray-600 uppercase mt-4 flex gap-2 border-yellow-500 border-2 justify-center rounded-full py-0.5 items-center font-semibold"
                : "w-32 text-gray-600 uppercase mt-4 flex gap-2 border-green-400 border-2 justify-center rounded-full py-0.5 items-center font-semibold"
            }
          >
            {userData.role === "admin" && (
              <FontAwesomeIcon className="text-yellow-500" icon={faCrown} />
            )}
            {userData.role === "acl" && (
              <FontAwesomeIcon className="text-green-400" icon={faUser} />
            )}
            {userData.role}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6  mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-semibold uppercase">
            Informations personnelles
          </h2>
          <div className="flex justify-end">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className={`flex items-center  cursor-pointer gap-2 px-4 py-2 rounded-lg ${
                isEditingProfile ? "text-red-400" : "text-blue-400"
              }`}
            >
              {isEditingProfile ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Annuler</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  <span>Modifier</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <TitreLabel titre="Nom complet" />
            <InputOn
              width="w-full"
              disabled={!isEditingProfile}
              value={userData.name}
              onChange={(value) => handleInputChange("name", value)}
              onBlur={() => handleInputBlur("name")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <TitreLabel titre="Email" />
            <InputOn
              width="w-full"
              type="email"
              disabled={!isEditingProfile}
              value={userData.email}
              onChange={(value) => handleInputChange("email", value)}
              onBlur={() => handleInputBlur("email")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <TitreLabel titre="Contact téléphonique" />
            <InputOn
              width="w-full"
              type="tel"
              disabled={!isEditingProfile}
              value={userData.numeros || ""}
              onChange={(value) => handleInputChange("numeros", value)}
              onBlur={() => handleInputBlur("numeros")}
            />
          </div>
        </div>
      </div>

      {/* Section Changement de mot de passe */}
      <div className="bg-gray-50 rounded-xl p-6 ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-semibold uppercase">Sécurité</h2>
          <button
            onClick={togglePasswordChange}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
              isChangingPassword ? "text-red-400" : "text-blue-400"
            }`}
          >
            {isChangingPassword ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>Annuler</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                <span>Modifier</span>
              </>
            )}
          </button>
        </div>

        {isChangingPassword && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <TitreLabel titre="Mot de passe actuel" />
              <div className="relative">
                <InputOn
                  width="w-full"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwords.current_password}
                  onChange={(value) =>
                    setPasswords((prev) => ({
                      ...prev,
                      current_password: value,
                    }))
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <TitreLabel titre="Nouveau mot de passe" />
              <div className="relative">
                <InputOn
                  width="w-full"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwords.new_password}
                  onChange={(value) =>
                    setPasswords((prev) => ({ ...prev, new_password: value }))
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <TitreLabel titre="Confirmer le mot de passe" />
              <div className="relative">
                <InputOn
                  width="w-full"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwords.confirm_password}
                  onChange={(value) =>
                    setPasswords((prev) => ({
                      ...prev,
                      confirm_password: value,
                    }))
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <ButtonAdd
                label={isLoading ? "CHARGEMENT" : "ENREGISTRER"}
                isLoad={isLoading}
                onClick={handlePasswordSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
