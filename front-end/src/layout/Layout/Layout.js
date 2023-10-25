import React from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { ActionButton, Sidebar } from "../../components";
import AddResevationModal from "../../modals/AddResevationModal";
import { fetchReservations } from "../../utils/api";

import styles from "./Layout.module.css";

const Layout = () => {
  const initialState = {
    openModal: false,
  };
  const [state, setState] = React.useState(initialState);

  const handleStateUpdate = (newState) =>
    setState((state) => ({ ...state, ...newState }));

  const handleFetchReservation = React.useCallback(async () => {
    const controller = new AbortController();
    try {
      const res = await fetchReservations(controller.signal);
      if (!res) throw new Error(res.message);
    } catch (error) {
      toast.error("Something went wrong");
    }
    return () => controller.abort();
  }, []);

  return (
    <section className={styles.Layout}>
      <Sidebar />
      <div className={styles.Layout_content}>
        <Outlet />
      </div>
      <AddResevationModal
        show={state.openModal}
        handleClose={() => handleStateUpdate({ openModal: false })}
        refresh={handleFetchReservation}
      />
      <ActionButton action={() => handleStateUpdate({ openModal: true })} />
    </section>
  );
};

export default Layout;
