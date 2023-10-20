// Routes.js
import React from "react";
import NotFound from "./NotFound";
import Layout from "./Layout/Layout";
import { Navigate, useRoutes } from "react-router";
import Dashboard from "../pages/Dashboard";
import { dashboardPagePath, reservationPagePath } from "../data/pageRoutes";
import Reservations from "../pages/Reservations";

const Routes = () => {
  return useRoutes([
    {
      element: <Layout />,
      children: [
        {
          path: dashboardPagePath,
          element: <Dashboard />,
          index: true,
        },
        {
          element: <Dashboard />,
          path: dashboardPagePath,
        },
        {
          element: <Reservations />,
          path: reservationPagePath,
        },
      ],
    },
    {
      path: "/*",
      element: <NotFound />,
    },
  ]);
};

export default Routes;
