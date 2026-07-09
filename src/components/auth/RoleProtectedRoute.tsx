import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  role: UserRole;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  role,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Wait until auth is loaded
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // User not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (user.role !== role) {
    return (
      <Navigate
        to={
          user.role === "entrepreneur"
            ? "/dashboard/entrepreneur"
            : "/dashboard/investor"
        }
        replace
      />
    );
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;