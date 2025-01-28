import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from "react-router-dom"
import Footer from './components/Footer'

function App() {
  
  return (
    <> 
      <Navbar /> 
      <Outlet/>
      <Footer/>
      </>   
   
  )
}

export default App
