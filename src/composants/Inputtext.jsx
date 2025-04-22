import React from 'react'
import '../styles/Inputlogin.css'

export default function Inputtext() {
  return (
    <div className="wrapper">
      <div className="inputlogin">
        <input
          placeholder="Entrer votre email"
          className="inputlogin--input w-64"
          type='email'
        />
      </div>
    </div>)
}
