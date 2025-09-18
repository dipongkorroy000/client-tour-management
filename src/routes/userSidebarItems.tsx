import Bookings from "@/pages/user/Bookings";
import type { ISidebarItem } from "@/types";

const userSidebarItems: ISidebarItem[] = [
  {
    title: "History",
    items: [
      {
        title: "Bookings",
        url: "/user/bookings",
        component: Bookings,
      },
    ],
  },
];

export default userSidebarItems;