import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Ensure this is imported here or in App.jsx
import App from './App.jsx'
import './index.css'

// Note: If BrowserRouter is inside App.jsx, add flags there. 
// If it's here, use this structure:
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)