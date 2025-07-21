import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,

} from "react-router-dom";
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import VidOverlay from './components/Home/VidOverlay.jsx'
import Feature from './components/Home/Feature.jsx'
import Pricing from './components/User/Pricing.jsx'
import Terms from './components/User/Terms.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path='/' element={<App />}>
      <Route path="" element={<HomePage />} />
      <Route path="how-it-works" element={<VidOverlay />} />
      <Route path="features" element={<Feature />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="pricing" element={<Pricing />} />
      <Route path="terms" element={<Terms />} />
    </Route>
    

  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)