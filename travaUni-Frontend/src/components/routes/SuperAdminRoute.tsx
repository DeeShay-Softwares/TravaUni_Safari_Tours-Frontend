import { Navigate } from "react-router-dom";

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  // Get user from localStorage (simplest way)
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Check if user exists and has SuperAdmin role
  const isSuperAdmin = user?.role === "Super Admin";

  if (!isSuperAdmin) {
    // Redirect to dashboard if not SuperAdmin
    return <Navigate to="/admin" replace />;
  }

  // Render the protected component if SuperAdmin
  return <>{children}</>;
};

export default SuperAdminRoute;
