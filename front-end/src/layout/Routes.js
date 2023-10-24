// Routes.js
import React from "react";
import NotFound from "./NotFound";
import Layout from "./Layout/Layout";
import { useRoutes } from "react-router";
import Dashboard from "../pages/Dashboard";
import { dashboardPagePath, reservationPagePath } from "../data/pageRoutes";
import { PAGE_CONFIG } from "../data/pageConfig";
import EditReservation from "../pages/EditReservation";
import AssignSeat from "../pages/AssignSeat";

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
        ...PAGE_CONFIG.map((item) => ({
          element: item.component,
          path: item.routes,
        })),
      ],
    },
    {
      element: <EditReservation />,
      path: `${reservationPagePath}/:reservation_id/edit`,
    },
    {
      element: <AssignSeat />,
      path: `${reservationPagePath}/:reservation_id/seat`,
    },
    {
      path: "/*",
      element: <NotFound />,
    },
  ]);
};

export default Routes;
