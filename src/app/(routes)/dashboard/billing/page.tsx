import { PricingTable } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className='px-10  '>
      <h2 className='font-bold text-3xl mb-6'>Join Subscription</h2>
      <PricingTable/>
    </div>
  )
}

export default page
