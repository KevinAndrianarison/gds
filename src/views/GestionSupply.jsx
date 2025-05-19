import React from 'react'
import Entete from '../composants/Entete'
import SupplyForm from '../composants/SupplyForm'
import SupplyTable from '../composants/Supplytable'

export default function GestionSupply() {
  return (
    <div className='w-[80vw] mx-auto'>
      <Entete titre="supply" description="gérez vos stocks" />
      <SupplyForm />
      <SupplyTable />
    </div>
  )
}
