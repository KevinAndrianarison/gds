import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../styles/Inputlogin.css';

export default function Inputpassword({ value, onChange, required = false }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className="wrapper flex items-center">
      <div className="inputlogin relative">
        <input
          value={value}
          onChange={onChange}
          placeholder="Mot de passe"
          className="inputlogin--input w-64 pr-10 max-sm:w-80"
          type={showPassword ? 'text' : 'password'}
          required={required}
        />
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={togglePasswordVisibility}
        />
      </div>
    </div>
  );
}
