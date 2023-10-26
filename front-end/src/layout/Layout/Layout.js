import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ActionButton, Sidebar } from "../../components";

import styles from "./Layout.module.css";
import { addReservationPagePath } from "../../data/pageRoutes";

const Layout = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.Layout}>
      <Sidebar />
      <div className={styles.Layout_content}>
        <Outlet />
      </div>

      <ActionButton action={() => navigate(addReservationPagePath)} />
    </section>
  );
};

export default Layout;
