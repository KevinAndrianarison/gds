import React from "react";
import "../styles/Buttonout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexte/AuthContext";
import { useContext } from "react";

export default function Buttonout({ label, onClick }) {
  const { isLoading } = useContext(AuthContext);
  return (
    <div>
      <button
        onClick={onClick}
        disabled={isLoading}
        className="cursor-pointer btnout max-sm:w-80 py-4 w-64 text-sm text-white rounded-3xl bg-blue-400"
      >
        {isLoading ? (
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
        ) : (
          label
        )}
      </button>
    </div>
  );
}
