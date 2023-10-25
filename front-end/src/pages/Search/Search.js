import React from "react";
import { RESERVATION_MOCK_DATA } from "../../data/mockData";
import { getSearchedResult } from "../../utils/generics";
import { toast } from "react-toastify";
import { uniqueId } from "lodash";
import { getReservationsActions } from "../../data/tableConfig";
import { CancelReservationModal } from "../../modals";
import { BiSearch } from "react-icons/bi";
import { listReservations } from "../../utils/api";

import styles from "./Search.module.css";

const Search = () => {
  const initialState = {
    openModal: false,
    modalType: null,
    activeReservation: null,
    search: "",
    searchedResult: null,
  };

  const [state, setState] = React.useState(initialState);

  const handleStateUpdate = (newState) =>
    setState((state) => ({ ...state, ...newState }));

  const searchData = RESERVATION_MOCK_DATA[4];
  const searchedResults = state.searchedResult
    ? getSearchedResult(state.searchedResult[0])
    : null;
  const searchActions = getReservationsActions(handleStateUpdate);

  const handleSearchCallback = React.useCallback(
    async (e) => {
      try {
        e.preventDefault();
        const res = await listReservations({ mobile_number: state.search });

        if (res) handleStateUpdate({ searchedResult: res });
      } catch (error) {
        toast.error("Something went wrong getting reservations");
        console.log(error);
      }
    },
    [state.search]
  );

  return (
    <section className={styles.Search}>
      <div className={styles.Search_form}>
        <input
          type="tel"
          className={styles.Search_form_input}
          name="search"
          id="search"
          placeholder="222-333-4444"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          value={state.search}
          onChange={(e) => handleStateUpdate({ search: e.currentTarget.value })}
        />

        <BiSearch
          onClick={(e) => handleSearchCallback(e)}
          className={styles.Search_form_icon}
        />
      </div>

      {!!searchedResults ? (
        <div className={styles.Search_result}>
          <h3 className={styles.Search_result_title}>Searched result</h3>

          <ul className={styles.Search_result_data}>
            {searchedResults.map((item) => (
              <li
                key={uniqueId("searched-result_")}
                className={styles.Search_result_data_item}
              >
                <p>{item.label}</p>
                <p>{item.value}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.Search_result}>
          <p>No searched result</p>
        </div>
      )}

      {!!searchedResults && (
        <div className={styles.Search_actions}>
          {searchActions?.map((action) => {
            const isVisible = action.handleVisibility
              ? action.handleVisibility(searchData)
              : false;

            return (
              <React.Fragment key={uniqueId("search-action_")}>
                {isVisible ? action.render(searchData) : null}
              </React.Fragment>
            );
          })}
        </div>
      )}

      <CancelReservationModal
        reservation={state.activeReservation}
        show={state.openModal && state.modalType === "cancel"}
        handleClose={() =>
          handleStateUpdate({ openModal: false, modalType: null })
        }
        refresh={handleSearchCallback}
      />
    </section>
  );
};

export default Search;
