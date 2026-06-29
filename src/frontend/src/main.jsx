import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import App from './App.jsx'
import { GOOGLE_CLIENT_ID } from './utils/googleAuth'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <React.StrictMode>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>,
)