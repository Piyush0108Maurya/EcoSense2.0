import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { AirQualityPage } from './pages/AirQualityPage'
import { EcoSortPage } from './pages/EcoSortPage'
import { NeighbourhoodWasteMapPage } from './pages/NeighbourhoodWasteMapPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/air-quality" replace />} />
          <Route path="air-quality" element={<AirQualityPage />} />
          <Route path="eco-sort" element={<EcoSortPage />} />
          <Route path="neighbourhood-waste-map" element={<NeighbourhoodWasteMapPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/air-quality" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
