import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import CustomErrorBoundaryForRoutes from '@/Components/Common/CustomErrorBoundaryForRoutes.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename='/mobile-lams'>
        {/* <BrowserRouter basename='/'> */}
      <Suspense fallback={<div className="font-bold text-lg italic h-screen w-screen flex items-center justify-center">Loading...</div>}>
        <CustomErrorBoundaryForRoutes errorMsg="Something went wrong. Please try again later !">
          <App />
        </CustomErrorBoundaryForRoutes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
)
