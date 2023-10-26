import React from "react";
import { CiCirclePlus } from "react-icons/ci";

import styles from "./ActionButton.module.css";

const ActionButton = ({ action }) => {
  return (
    <div className={styles.ActionButton} onClick={action}>
      <button className={styles.ActionButton_button}>
        <span>Add reservation</span>
        <CiCirclePlus />
      </button>
    </div>
  );
};

export default ActionButton;
