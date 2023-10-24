import React from "react";
import { Table } from "../../components";
import { RESERVATION_MOCK_DATA, TABLE_MOCK_DATA } from "../../data/mockData";
import {
  AddReservationModal,
  CheckoutModal,
  CancelReservationModal,
  CreateTableModal,
} from "../../modals";
import {
  getReservationsActions,
  getReservationsDataSchema,
  getTableDataSchema,
} from "../../data/tableConfig";

import styles from "./Dashboard.module.css";
import { next, previous } from "../../utils/date-time";
import { format } from "date-fns";

const Dashboard = () => {
  const currentDate = format(new Date(), "yyyy-MM-dd");

  const initialState = {
    openModal: false,
    modalType: null,
    activeReservation: null,
    activeTableId: null,
    date: currentDate,
  };

  const [state, setState] = React.useState(initialState);

  const handleStateUpdate = (newState) =>
    setState((state) => ({ ...state, ...newState }));

  const reservationsData = RESERVATION_MOCK_DATA.filter(
    (item) =>
      format(new Date(item.reservation_date), "yyyy-MM-dd") === state.date
  );

  const reservationsDataSchema = getReservationsDataSchema();

  const reservationsActions = getReservationsActions(handleStateUpdate);

  const tableDataSchema = getTableDataSchema(handleStateUpdate);

  const handleDateUpdate = (type) => {
    if (type === "next") handleStateUpdate({ date: next(state.date) });
    if (type === "prev") handleStateUpdate({ date: previous(state.date) });
  };

  return (
    <section className={styles.Dashboard}>
      <div className={styles.Dashboard_content}>
        <h1 className={styles.Dashboard_content_title}>Reservations</h1>
        <Table
          data={reservationsData}
          dataSchema={reservationsDataSchema}
          actions={reservationsActions}
        />
        <div className={styles.Dashboard_content_btns}>
          <button onClick={() => handleDateUpdate("prev")}>Prev</button>
          <button onClick={() => handleDateUpdate("next")}>Next</button>
        </div>
      </div>

      <div className={styles.Dashboard_table}>
        <h1 className={styles.Dashboard_table_title}>Tables</h1>
        <Table data={TABLE_MOCK_DATA} dataSchema={tableDataSchema} />
        <button
          className={styles.Dashboard_table_btn}
          onClick={() =>
            handleStateUpdate({ openModal: true, modalType: "create-table" })
          }
        >
          Create Table
        </button>
      </div>

      <AddReservationModal
        data={state.activeReservation}
        show={state.openModal && state.modalType === "edit"}
        type={"edit"}
        handleClose={() =>
          handleStateUpdate({ openModal: false, modalType: null })
        }
      />

      <CreateTableModal
        show={state.openModal && state.modalType === "create-table"}
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

      <CheckoutModal
        table_id={state.activeTableId}
        show={state.openModal && state.modalType === "finished"}
        handleClose={() =>
          handleStateUpdate({ openModal: false, modalType: null })
        }
      />
    </section>
  );
};

export default Dashboard;
