/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DataProvider } from '@/context/DataContext'
import Index from './pages/Index'
import PetsList from './pages/PetsList'
import NewPetForm from './pages/NewPetForm'
import PetDetails from './pages/PetDetails'
import ListingDetails from './pages/ListingDetails'
import Checkout from './pages/Checkout'
import HostDashboard from './pages/HostDashboard'
import ReservationsChat from './pages/ReservationsChat'
import ReviewsPage from './pages/ReviewsPage'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

const App = () => (
  <BrowserRouter>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/pets" element={<PetsList />} />
            <Route path="/pets/novo" element={<NewPetForm />} />
            <Route path="/pets/:id" element={<PetDetails />} />
            <Route path="/listings/:id" element={<ListingDetails />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/host" element={<HostDashboard />} />
            <Route path="/reservations" element={<ReservationsChat />} />
            <Route path="/reviews" element={<ReviewsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </DataProvider>
  </BrowserRouter>
)

export default App
