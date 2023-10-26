// Routes.js
import React from "react";
import NotFound from "./NotFound";
import Layout from "./Layout/Layout";
import { useRoutes, Navigate } from "react-router";
import {
  addReservationPagePath,
  addTablePagePath,
  dashboardPageSlug,
  reservationPagePath,
} from "../data/pageRoutes";
import { PAGE_CONFIG } from "../data/pageConfig";
import EditReservation from "../pages/EditReservation";
import AssignSeat from "../pages/AssignSeat";
import AddReservation from "../pages/AddReservation";
import AddTable from "../pages/AddTable";

const Routes = () => {
  return useRoutes([
    {
      element: <Layout />,
      path: "/",
      children: [
        {
          element: <Navigate to={dashboardPageSlug} replace />,
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
      element: <AddTable />,
      path: addTablePagePath,
    },
    {
      element: <AddReservation />,
      path: addReservationPagePath,
    },
    {
      path: "/*",
      element: <NotFound />,
    },
  ]);
};

export default Routes;
