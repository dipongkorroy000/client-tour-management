import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    if (isLoading) return <h2>loading... </h2>;

    if (!isLoading && !data?.data?.email) return <Navigate to="/login"></Navigate>;

    if (requiredRole && !isLoading && requiredRole !== data?.data?.role) {
      return <Navigate to="/unauthorized"></Navigate>;
    }

    return <Component></Component>;
  };
};

export default withAuth;
