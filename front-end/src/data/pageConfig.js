import React from "react";

import Dashboard from "../pages/Dashboard";
import Reservations from "../pages/Reservations";
import Search from "../pages/Search";

import { VscBook, VscHome } from "react-icons/vsc";
import { MdOutlineManageSearch } from "react-icons/md";

import {
  dashboardPagePath,
  reservationPagePath,
  searchPagePath,
} from "./pageRoutes";

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
  {
    icon: <MdOutlineManageSearch />,
    label: "Search",
    routes: searchPagePath,
    component: <Search />,
  },
];
