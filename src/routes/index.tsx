import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/verify";
import generateRoutes from "@/utils/generateRoutes";
import { createBrowserRouter, Navigate } from "react-router";
import adminSidebarItems from "./adminSidebarItems";
import userSidebarItems from "./userSidebarItems";
import withAuth from "@/utils/withAuth";
import Unauthorized from "@/pages/Unauthorized";
import { role } from "@/constants/role";
import type { TRole } from "@/types";
import superSidebarItems from "./superSidebarItems";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: withAuth(About),
        path: "about",
      },
    ],
  },
  {
    path: "/admin",
    Component: withAuth(DashboardLayout, role.admin as TRole),
    children: [{ index: true, element: <Navigate to="/admin/analytics"></Navigate> }, ...generateRoutes(adminSidebarItems)],
  },
  {
    path: "/super-admin",
    Component: withAuth(DashboardLayout, role.superAdmin as TRole),
    children: [{ index: true, element: <Navigate to="/super-admin/analytics"></Navigate> }, ...generateRoutes(superSidebarItems)],
  },
  {
    path: "/user",
    Component: withAuth(DashboardLayout, role.user as TRole),
    children: [{ index: true, element: <Navigate to="/user/bookings"></Navigate> }, ...generateRoutes(userSidebarItems)],
  },

  {
    Component: Login,
    path: "/login",
  },
  {
    Component: Register,
    path: "/register",
  },
  {
    Component: Verify,
    path: "/verify",
  },
  {
    Component: Unauthorized,
    path: "/unauthorized",
  },
]);
