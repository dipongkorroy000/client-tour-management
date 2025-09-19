import AddDivision from "@/pages/admin/AddDivision";
import AddTour from "@/pages/admin/AddTour";
import AddTourType from "@/pages/admin/AddTourType";
import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/admin/Analytics"));

const superSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [{ title: "Analytics", url: "/super-admin/analytics", component: Analytics }],
  },
  {
    title: "Tour Management",
    items: [
      { title: "Add Tour Type", url: "/super-admin/add-tour-type", component: AddTourType },
      { title: "Add Tour", url: "/super-admin/add-tour", component: AddTour },
      { title: "Add Division", url: "/super-admin/add-division", component: AddDivision },
    ],
  },
];

export default superSidebarItems;
