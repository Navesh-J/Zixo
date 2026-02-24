import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner"; // Import Sonner

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {/* Styled Toaster for Cyber-Gothic look */}
          <Toaster 
            theme="dark" 
            position="top-center" 
            closeButton
            toastOptions={{
              style: {
                background: 'var(--color-goth-void)',
                border: '1px solid var(--color-goth-blood)',
                color: '#f5f5f5',
                fontFamily: 'var(--font-cyber)',
                borderRadius: '0px',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
);