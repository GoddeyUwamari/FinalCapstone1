import React from "react";
import Portal from "../Portal";
import cx from "classnames";

import styles from "./Modal.module.css";

const Modal = ({ show, handleClose, className, children }) => {
  const portalId = `modal_${new Date().getTime()}`;
  return show ? (
    <Portal
      portalId={portalId}
      className={styles.Modal}
      onClick={() => handleClose && handleClose()}
    >
      <div className={cx(styles.Modal_content, className)}>
        <button className={styles.Modal_content_button} onClick={handleClose}>
          X
        </button>

        {children}
      </div>
    </Portal>
  ) : null;
};

export default Modal;
