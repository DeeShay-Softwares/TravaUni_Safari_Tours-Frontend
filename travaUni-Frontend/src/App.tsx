import "./App.css";
import ViewAllTripsPage from "./pages/ViewAllTripsPage";
import AdminPage from "./pages/AdminPage";
import { Routes, Route, Navigate } from "react-router-dom"; // Added BrowserRouter
import { HeroPage } from "./pages/HeroPage";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./assets/constants/Theme";
import { HomePage } from "./pages/HomePage";
import ViewTripGallery from "./components/ViewTripGallery";
import ViewBookedTripsPage from "./pages/ViewBookedTripsPage";
import AccountPage from "./To-be-used_files&pages/AccountsPage";
import BookingPage from "./pages/BookingPage";
import AdminManagement from "./pages/RegisterAdminPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import SuperAdminRoute from "./components/routes/SuperAdminRoute";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* Main page with all sections */}
          <Route
            path="/"
            element={
              <>
                <HomePage />
              </>
            }
          />

          {/* Routes using MainLayout wrapper */}
          {/* <Route element={<MainLayout />}> */}
          <Route path="/" element={<HeroPage />} />
          {/* </Route> */}

          {/* Standalone routes without layout */}
          <Route path="/trips" element={<ViewAllTripsPage />} />

          <Route path="/viewgallery" element={<ViewTripGallery />} />
          <Route path="/viewtrips" element={<ViewBookedTripsPage />} />
          <Route path="/bookingview" element={<AccountPage />} />
          <Route path="/book" element={<BookingPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* SuperAdmin only route */}
          <Route
            path="/regAdmin"
            element={
              <SuperAdminRoute>
                <AdminManagement />
              </SuperAdminRoute>
            }
          />

          {/* Redirect if someone tries to access directly */}
          <Route
            path="/admin"
            element={
              <SuperAdminRoute>
                <AdminManagement />
              </SuperAdminRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
