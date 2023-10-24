import React from "react";
import { Table } from "../../components";
import { RESERVATION_MOCK_DATA } from "../../data/mockData";
import { AddReservationModal, CancelReservationModal } from "../../modals";
import {
  getReservationsActions,
  getReservationsDataSchema,
} from "../../data/tableConfig";

import styles from "./Reservations.module.css";

const Reservations = () => {
  const initialState = {
    openModal: false,
    modalType: null,
    activeReservation: null,
  };

  const [state, setState] = React.useState(initialState);

  const handleStateUpdate = (newState) =>
    setState((state) => ({ ...state, ...newState }));

  const tableDataSchema = getReservationsDataSchema();

  const tableActions = getReservationsActions(handleStateUpdate);

  return (
    <section className={styles.Reservations}>
      <h3 className={styles.Reservations_title}>Reservations</h3>

      <Table
        data={RESERVATION_MOCK_DATA}
        dataSchema={tableDataSchema}
        actions={tableActions}
      />

      <AddReservationModal
        data={state.activeReservation}
        show={state.openModal && state.modalType === "edit"}
        type={"edit"}
        handleClose={() =>
          handleStateUpdate({ openModal: false, modalType: null })
        }
      />

      <CancelReservationModal
        reservation={state.activeReservation}
        show={state.openModal && state.modalType === "cancel"}
        handleClose={() =>
          handleStateUpdate({ openModal: false, modalType: null })
        }
      />
    </section>
  );
};

export default Reservations;
