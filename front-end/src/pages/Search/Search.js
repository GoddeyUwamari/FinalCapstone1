import React from "react";
import { toast } from "react-toastify";
import { BiSearch } from "react-icons/bi";
import { ImFilesEmpty } from "react-icons/im";
import {
  getReservationsActions,
  getReservationsDataSchema,
} from "../../data/tableConfig";
import { Table } from "../../components";
import { CancelReservationModal } from "../../modals";
import { listReservations } from "../../utils/api";

import styles from "./Search.module.css";

const Search = () => {
  const initialState = {
    openModal: false,
    activeReservation: null,
    mobile_number: "",
    searchedResult: null,
  };

  const [state, setState] = React.useState(initialState);

  const handleStateUpdate = (newState) =>
    setState((state) => ({ ...state, ...newState }));

  const dataSchema = getReservationsDataSchema();
  const actions = getReservationsActions(handleStateUpdate);

  const handleSearchCallback = React.useCallback(
    async (e) => {
      try {
        e.preventDefault();
        if (state.mobile_number !== "") {
          const res = await listReservations({
            mobile_number: state.mobile_number,
          });
          handleStateUpdate({ searchedResult: res, mobile_number: "" });
        } else {
          toast.error("Enter a valid mobile number");
        }
      } catch (error) {
        toast.error("Something went wrong getting reservations");
      }
    },
    [state.mobile_number]
  );

  return (
    <section className={styles.Search}>
      <form className={styles.Search_form} onSubmit={handleSearchCallback}>
        <input
          type="tel"
          className={styles.Search_form_input}
          name="mobile_number"
          id="mobile_number"
          placeholder="222-333-4444"
          value={state.mobile_number}
          onChange={(e) =>
            handleStateUpdate({ mobile_number: e.currentTarget.value })
          }
        />

        <button type="submit">
          <BiSearch className={styles.Search_form_icon} />
        </button>
      </form>

      {state.searchedResult && state.searchedResult.length === 0 ? (
        <div className={styles.Search_notFound}>
          <ImFilesEmpty />
          <p>No reservations found</p>
        </div>
      ) : (
        <div className={styles.Search_result}>
          <h3 className={styles.Search_result_title}>Searched result</h3>

          <Table
            data={state.searchedResult}
            dataSchema={dataSchema}
            actions={actions}
          />
        </div>
      )}

      <CancelReservationModal
        reservation={state.activeReservation}
        show={state.openModal}
        handleClose={() => handleStateUpdate({ openModal: false })}
        refresh={handleSearchCallback}
      />
    </section>
  );
};

export default Search;
