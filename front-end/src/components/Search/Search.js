import React from "react";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router";

import styles from "./Search.module.css";
import { reservationPagePath } from "../../data/pageRoutes";

const Search = () => {
  const [value, setValue] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = React.useCallback(
    (e) => {
      e.preventDefault();
      if (value === "") return;
      else {
        console.log(value);
        navigate(reservationPagePath);
      }
    },
    [value, navigate]
  );
  return (
    <div className={styles.Search}>
      <input
        type="text"
        className={styles.Search_input}
        name="search"
        id="search"
        placeholder="Search reservation"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />

      <BiSearch
        onClick={(e) => handleSubmit(e)}
        className={styles.Search_icon}
      />
    </div>
  );
};

export default Search;
