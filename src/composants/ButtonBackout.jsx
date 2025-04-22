
import React from 'react'
import '../styles/Buttonout.css'

export default function ButtonBackout({back}) {
  return (
    <div>
        <button onClick={back} className='cursor-pointer btnout py-4 w-64 text-sm text-white rounded-3xl bg-gray-500'>RETOUR</button>
    </div>
  )
}
