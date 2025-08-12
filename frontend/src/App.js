import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doctor from "./pages/doctor";
import Pharmacy from "./pages/pharmacy";

// Small helper component so we can use the hook correctly
function HomeRedirect() {
  const { isAuthed, role } = useAuth();
  return isAuthed ? <Navigate to={`/${role}`} replace /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* IMPORTANT: root now routes based on auth/role */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/doctor"
            element={
              <ProtectedRoute allow={["doctor"]}>
                <Doctor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pharmacy"
            element={
              <ProtectedRoute allow={["pharmacy"]}>
                <Pharmacy />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
