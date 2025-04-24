import React from 'react'
import '../styles/Inputlogin.css'

export default function InputemailForgot() {
    return (
        <div className="wrapper">
            <div className="inputlogin mx-auto max-sm:w-80">
                <input
                    placeholder="Entrer votre email"
                    className="inputlogin--input w-full "
                    type='email'
                />
            </div>
        </div>)
}
