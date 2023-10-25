import React from "react";
import { Table } from "../../components";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import {
  FinishedTableModal,
  CancelReservationModal,
  CreateTableModal,
} from "../../modals";
import {
  getReservationsActions,
  getReservationsDataSchema,
  getTableDataSchema,
} from "../../data/tableConfig";
import { next, previous, today } from "../../utils/date-time";
import { listReservations, fetchTables } from "../../utils/api";

import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const currentDate = today();
  const [searchParams] = useSearchParams();
  searchParams.set("date", currentDate);

  const initialState = {
    openModal: false,
    modalType: null,
    activeReservation: null,
    activeTableId: null,
    date: currentDate,
    reservations: null,
    tables: null,
  };

  const [state, setState] = React.useState(initialState);

  const handleStateUpdate = (newState) =>
    setState((state) => ({ ...state, ...newState }));

  const reservationsDataSchema = getReservationsDataSchema();

  const reservationsActions = getReservationsActions(handleStateUpdate);

  const tableDataSchema = getTableDataSchema(handleStateUpdate);

  const handleDateUpdate = (type) => {
    if (type === "next") handleStateUpdate({ date: next(state.date) });
    if (type === "prev") handleStateUpdate({ date: previous(state.date) });
  };

  const handleFetchReservationsCallback = React.useCallback(
    async (signal) => {
      try {
        const res = await listReservations({ date: state.date }, signal);

        if (res) handleStateUpdate({ reservations: res });
      } catch (error) {
        toast.error("Something went wrong getting reservations");
      }
    },
    [state.date]
  );

  const handleFetchTable = React.useCallback(async (signal) => {
    try {
      const res = await fetchTables(signal);

      if (res) {
        const tableData = res.map((item) => {
          let status;
          if (item.reservation_id === null) status = "free";
          else status = "occupied";

          return {
            ...item,
            status,
          };
        });
        handleStateUpdate({ tables: tableData });
      }
    } catch (error) {
      toast.error("Something went wrong getting tables");
      console.log(error);
    }
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    handleFetchTable(controller.signal);

    return () => controller.abort();
  }, [handleFetchTable]);

  React.useEffect(() => {
    const controller = new AbortController();
    handleFetchReservationsCallback(controller.signal);

    return () => controller.abort();
  }, [state.date, handleFetchReservationsCallback]);

  return (
    <section className={styles.Dashboard}>
      <div className={styles.Dashboard_content}>
        <h1 className={styles.Dashboard_content_title}>Reservations</h1>
        <Table
          data={state.reservations}
          dataSchema={reservationsDataSchema}
          actions={reservationsActions}
        />
        <div className={styles.Dashboard_content_btns}>
          <button onClick={() => handleDateUpdate("prev")}>Prev</button>
          <span>
            Reservation for {format(new Date(state.date), "eeee MMM dd, yyyy")}
          </span>
          <button onClick={() => handleDateUpdate("next")}>Next</button>
        </div>
      </div>

      <div className={styles.Dashboard_table}>
        <h1 className={styles.Dashboard_table_title}>Tables</h1>
        <Table data={state.tables} dataSchema={tableDataSchema} />
        <button
          className={styles.Dashboard_table_btn}
          onClick={() =>
            handleStateUpdate({ openModal: true, modalType: "create-table" })
          }
        >
          Create Table
        </button>
      </div>

      <CreateTableModal
        show={state.openModal && state.modalType === "create-table"}
        handleClose={() =>
          handleStateUpdate({ openModal: false, modalType: null })
        }
        refresh={handleFetchTable}
      />

      <CancelReservationModal
        reservation={state.activeReservation}
        show={state.openModal && state.modalType === "cancel"}
        handleClose={() =>
          handleStateUpdate({ openModal: false, modalType: null })
        }
        refresh={handleFetchReservationsCallback}
      />

      <FinishedTableModal
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
