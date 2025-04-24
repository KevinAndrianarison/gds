
import React from 'react'
import '../styles/Buttonout.css'

export default function Buttonout({label, onClick}) {
  return (
    <div>
        <button onClick={onClick} className='cursor-pointer btnout max-sm:w-80 py-4 w-64 text-sm text-white rounded-3xl bg-blue-400'>{label}</button>
    </div>
  )
}
