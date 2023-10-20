import React from "react";
import { ActionButton, Sidebar } from "../../components";
import { Outlet } from "react-router-dom";

import styles from "./Layout.module.css";
import AddResevationModal from "../../modals/AddResevationModal";

const Layout = () => {
  const initialState = {
    openModal: false,
  };
  const [state, setState] = React.useState(initialState);

  const handleStateUpdate = (newState) =>
    setState((state) => ({ ...state, ...newState }));

  return (
    <section className={styles.Layout}>
      <Sidebar />
      <div className={styles.Layout_content}>
        <Outlet />
      </div>
      <AddResevationModal
        show={state.openModal}
        handleClose={() => handleStateUpdate({ openModal: false })}
      />
      <ActionButton action={() => handleStateUpdate({ openModal: true })} />
    </section>
  );
};

export default Layout;
