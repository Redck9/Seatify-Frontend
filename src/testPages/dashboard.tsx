import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppDashboard } from './app-dashboard.tsx'
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppDashboard />
  </StrictMode>,
)
