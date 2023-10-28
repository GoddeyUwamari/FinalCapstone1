import React from "react";

import styles from "./Modal.module.css";

const Modal = ({ show, children, handleClose, action }) => {
  return (
    <dialog open={show} className={styles.Modal}>
      <form className={styles.Modal_content}>
        {children}
        <div className={styles.Modal_content_btns}>
          <button
            className={styles.Modal_content_btns_cancel}
            onClick={handleClose}
            formMethod="dialog"
          >
            Cancel
          </button>
          <button
            onClick={action}
            type="button"
            className={styles.Modal_content_btns_action}
          >
            OK
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default Modal;
