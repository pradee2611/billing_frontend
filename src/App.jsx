import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AUTH_EXPIRED, clearToken, getToken } from "./api/auth.js";
import AppNavbar from "./components/AppNavbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NewOrderPage from "./pages/NewOrderPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";

export default function App() {
  const [signedIn, setSignedIn] = useState(Boolean(getToken()));

  useEffect(() => {
    const expired = () => setSignedIn(false);
    window.addEventListener(AUTH_EXPIRED, expired);
    return () => window.removeEventListener(AUTH_EXPIRED, expired);
  }, []);

  const signOut = () => {
    clearToken();
    setSignedIn(false);
  };

  if (!signedIn) return <LoginPage onLogin={() => setSignedIn(true)} />;

  return (
    <>
      <AppNavbar onSignOut={signOut} />
      <main className="container-xxl py-3">
        <Routes>
          <Route path="/" element={<OrdersPage />} />
          <Route path="/new" element={<NewOrderPage />} />
          <Route path="/edit/:id" element={<NewOrderPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
