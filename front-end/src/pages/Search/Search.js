import React from "react";
import { Search as SearchComponent } from "../../components";
import { RESERVATION_MOCK_DATA } from "../../data/mockData";
import { getSearchedResult } from "../../utils/generics";

import styles from "./Search.module.css";
import { uniqueId } from "lodash";
import { getReservationsActions } from "../../data/tableConfig";
import { AddReservationModal, CancelReservationModal } from "../../modals";
import { BiSearch } from "react-icons/bi";

const Search = () => {
  const initialState = {
    openModal: false,
    modalType: null,
    activeReservation: null,
    search: "",
  };

  const [state, setState] = React.useState(initialState);

  const handleStateUpdate = (newState) =>
    setState((state) => ({ ...state, ...newState }));

  const searchData = RESERVATION_MOCK_DATA[4];
  const searchedResults = getSearchedResult(searchData);
  const searchActions = getReservationsActions(handleStateUpdate);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(state.search);
  };

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
          onClick={(e) => handleSubmit(e)}
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
      ) : null}

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

export default Search;
