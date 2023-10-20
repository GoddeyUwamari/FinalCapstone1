import React from "react";
import Dashboard from "../pages/Dashboard";
import Reservations from "../pages/Reservations";
import { VscBook, VscHome } from "react-icons/vsc";
import { dashboardPagePath, reservationPagePath } from "./pageRoutes";

export const PAGE_CONFIG = [
  {
    icon: <VscHome />,
    label: "Dashboard",
    routes: dashboardPagePath,
    component: <Dashboard />,
  },
  {
    icon: <VscBook />,
    label: "Reservations",
    routes: reservationPagePath,
    component: <Reservations />,
  },
];
