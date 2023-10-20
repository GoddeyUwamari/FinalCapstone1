import React from "react";
import { uniqueId } from "lodash";
import { getSearchedResult } from "../../utils/generics";
import { Table } from "../../components";
import { RESERVATION_MOCK_DATA, TABLE_MOCK_DATA } from "../../data/mockData";
import {
  AddReservationModal,
  AssignSeatModal,
  UpdateStatusModal,
  CancelReservationModal,
} from "../../modals";
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

  const searchData = RESERVATION_MOCK_DATA[4];

  const searchedResults = getSearchedResult(searchData);

  return (
    <section className={styles.Reservations}>
      {!!searchedResults ? (
        <div className={styles.Reservations_search}>
          <h3 className={styles.Reservations_search_title}>Searched result</h3>

          <ul className={styles.Reservations_search_actions}>
            {tableActions.map((action) => {
              const testId =
                action.addTestId && action.addTestId(searchData)
                  ? action.addTestId(searchData)
                  : "";
              const isVisible = action.handleVisibility
                ? !action.handleVisibility(searchData)
                : true;
              return (
                <React.Fragment key={uniqueId("action_")}>
                  {isVisible ? (
                    <li onClick={() => action.onClick(searchData)} {...testId}>
                      {action.label}
                    </li>
                  ) : null}
                </React.Fragment>
              );
            })}
          </ul>

          <ul className={styles.Reservations_search_data}>
            {searchedResults.map((item) => (
              <li
                key={uniqueId("searched-result_")}
                className={styles.Reservations_search_data_item}
              >
                <p>{item.label}</p>
                <p>{item.value}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

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

export default Reservations;
