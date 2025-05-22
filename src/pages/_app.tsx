"use client";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import TenantLayout from "../layouts/TenantLayout";
import { ThemeProvider } from "../context/ThemeContext";
import "../styles/globals.css";
export const dynamic = 'force-dynamic';
function MyApp({ Component, pageProps }: any) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true); 
  }, []);

  if (!isClient) {
    return null; 
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <TenantLayout>
                <Component {...pageProps} />
              </TenantLayout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default MyApp;
