import React from 'react'
import FormRegion from '@/composants/FormRegion';
import InputSearch from '@/composants/InputSearch';
import FilterCroissant from '@/composants/FilterCroissant';
import FilterDecroissant from '@/composants/FilterDecroissant';
import Entete from '@/composants/Entete';



export default function Region() {
  return (
    <div className=' w-[60vw] mx-auto'>
      <Entete titre='régions' description='les régions où se trouvent vos bureaux.' />
      <FormRegion />
      <div className='mt-4 flex items-center gap-2'>
        <InputSearch />
        <FilterCroissant />
        <FilterDecroissant />
      </div>
    </div>
  )
}
