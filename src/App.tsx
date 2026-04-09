// App.tsx
import "./App.css";
import ViewAllTripsPage    from "./pages/ViewAllTripsPage";
import AdminDashboard      from "./pages/dashboard/mainDashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import { HeroPage }        from "./pages/HeroPage";
import { ThemeProvider }   from "@mui/material/styles";
import CssBaseline         from "@mui/material/CssBaseline";
import { theme }           from "./assets/constants/theme";
import { HomePage }        from "./pages/HomePage";
import ViewTripGallery     from "./components/ViewTripGallery";
import ViewBookedTripsPage from "./pages/ViewBookedTripsPage";
import AccountPage         from "./To-be-used_files&pages/AccountsPage";
import BookingPage         from "./pages/BookingPage";
import AdminManagement     from "./pages/RegisterAdminPage";
import { AuthProvider }    from "./context/AuthContext";
import ProtectedRoute      from "./components/routes/ProtectedRoute";
import SuperAdminRoute     from "./components/routes/SuperAdminRoute";
import TripPreviewPage from "./pages/TripPreviewPage";
function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>

          {/* ── Public routes ──────────────────────────────────────────── */}
          <Route path="/"            element={<HomePage />} />
          <Route path="/hero"        element={<HeroPage />} />
          <Route path="/trips"       element={<ViewAllTripsPage />} />
          <Route path="/viewgallery" element={<ViewTripGallery />} />
          <Route path="/viewtrips"   element={<ViewBookedTripsPage />} />
          <Route path="/bookingview" element={<AccountPage />} />
          <Route path="/book"        element={<BookingPage />} />

          {/* ── Admin — requires login ──────────────────────────────────
              ProtectedRoute uses the children pattern so we wrap each
              route's element individually.                              */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/trips/:tripTitle"
            element={
              <ProtectedRoute>
                <TripPreviewPage />
              </ProtectedRoute>
            }
          />

          {/* ── Super-admin — requires login AND super-admin role ───────
              ProtectedRoute guards auth, SuperAdminRoute guards the role */}
          <Route
            path="/regAdmin"
            element={
              <ProtectedRoute>
                <SuperAdminRoute>
                  <AdminManagement />
                </SuperAdminRoute>
              </ProtectedRoute>
            }
          />

          {/* ── Catch-all ───────────────────────────────────────────────  */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;