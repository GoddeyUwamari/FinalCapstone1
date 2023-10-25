import React from "react";
import { Table } from "../../components";
import { toast } from "react-toastify";
import { CancelReservationModal } from "../../modals";
import {
  getReservationsActions,
  getReservationsDataSchema,
} from "../../data/tableConfig";

import styles from "./Reservations.module.css";
import { fetchReservations } from "../../utils/api";

const Reservations = () => {
  const initialState = {
    openModal: false,
    activeReservation: null,
    reservations: null,
  };

  const [state, setState] = React.useState(initialState);

  const handleStateUpdate = (newState) =>
    setState((state) => ({ ...state, ...newState }));

  const tableDataSchema = getReservationsDataSchema();

  const tableActions = getReservationsActions(handleStateUpdate);

  const handleFetchReservations = React.useCallback(async (signal) => {
    try {
      const res = await fetchReservations(signal);

      if (res) handleStateUpdate({ reservations: res });
    } catch (error) {
      toast.error("Something went wrong fetching reservations");
      console.log(error);
    }
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    handleFetchReservations(controller.signal);

    return () => controller.abort();
  }, [handleFetchReservations]);

  return (
    <section className={styles.Reservations}>
      <h3 className={styles.Reservations_title}>Reservations</h3>

      <Table
        data={state.reservations}
        dataSchema={tableDataSchema}
        actions={tableActions}
      />

      <CancelReservationModal
        reservation={state.activeReservation}
        show={state.openModal}
        handleClose={() => handleStateUpdate({ openModal: false })}
        refresh={handleFetchReservations}
      />
    </section>
  );
};

export default Reservations;
