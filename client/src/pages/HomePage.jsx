import React from 'react'
import Hero from '../components/Home/Hero'
import VidOverlay from '../components/Home/VidOverlay'
import Feature from '../components/Home/Feature'
import Pricing from '../components/User/Pricing'

function HomePage() {
  return (
    <div>
      <Hero />
      <VidOverlay />
      <Feature />
      <Pricing />
    </div>

  )
}

export default HomePage