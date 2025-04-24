import React from 'react'
import '../styles/Inputlogin.css'

export default function Inputtext() {
  return (
    <div className="wrapper">
      <div className="inputlogin ">
        <input
          placeholder="Entrer votre email"
          className="inputlogin--input w-64 max-sm:w-80"
          type='email'
        />
      </div>
    </div>)
}
