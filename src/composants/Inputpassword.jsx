import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../styles/Inputlogin.css';

export default function Inputpassword() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className="wrapper flex items-center ">
      <div className="inputlogin relative">
        <input
          placeholder="Mot de passe"
          className="inputlogin--input w-64 pr-10 max-sm:w-80"
          type={showPassword ? 'text' : 'password'}
        />
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={togglePasswordVisibility}
        />
      </div>
    </div>
  );
}
