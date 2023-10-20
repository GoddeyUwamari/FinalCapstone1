import React from "react";
import { Search, Table } from "../../components";
import { RESERVATION_MOCK_DATA, TABLE_MOCK_DATA } from "../../data/mockData";
import {
  AddReservationModal,
  CheckoutModal,
  UpdateStatusModal,
  AssignSeatModal,
  CancelReservationModal,
  CreateTableModal,
} from "../../modals";
import {
  getReservationsActions,
  getReservationsDataSchema,
  getTableDataSchema,
} from "../../data/tableConfig";

import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const initialState = {
    openModal: false,
    modalType: null,
    activeReservation: null,
    activeTableId: null,
  };

  const [state, setState] = React.useState(initialState);

  const handleStateUpdate = (newState) =>
    setState((state) => ({ ...state, ...newState }));

  const currentDate = new Date().setHours(0, 0, 0, 0);

  const reservationsData = RESERVATION_MOCK_DATA.filter(
    (item) =>
      new Date(item.reservation_date).setHours(0, 0, 0, 0) === currentDate
  );

  const reservationsDataSchema = getReservationsDataSchema();

  const reservationsActions = getReservationsActions(handleStateUpdate);

  const tableDataSchema = getTableDataSchema(handleStateUpdate);

  return (
    <section className={styles.Dashboard}>
      <Search />

      <div className={styles.Dashboard_content}>
        <h1 className={styles.Dashboard_content_title}>Reservations</h1>
        <Table
          data={reservationsData}
          dataSchema={reservationsDataSchema}
          actions={reservationsActions}
        />
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

      <AssignSeatModal
        reservation_id={state.activeReservation?.reservation_id}
        tables={TABLE_MOCK_DATA}
        show={state.openModal && state.modalType === "assign-seat"}
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

      <UpdateStatusModal
        data={state.activeReservation}
        show={state.openModal && state.modalType === "status"}
        handleClose={() =>
          handleStateUpdate({ openModal: false, modalType: null })
        }
      />
    </section>
  );
};

export default Dashboard;
