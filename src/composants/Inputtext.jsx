import React from 'react'
import '../styles/Inputlogin.css'

export default function Inputtext({ value, onChange, placeholder = "Entrer votre email", type = "text", required = false }) {
  return (
    <div className="wrapper">
      <div className="inputlogin">
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="inputlogin--input w-64 max-sm:w-80"
          type={type}
          required={required}
        />
      </div>
    </div>)
}
