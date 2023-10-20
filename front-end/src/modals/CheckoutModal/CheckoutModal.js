import React from "react";
import { Modal } from "../../components";

import styles from "./CheckoutModal.module.css";

const CheckoutModal = ({ table_id, show, handleClose }) => {
  const handleCheckout = () => {
    console.log("Finished: ", table_id);
  };
  return (
    <Modal
      show={show}
      handleClose={handleClose}
      className={styles.CheckoutModal}
    >
      <h3 className={styles.CheckoutModal_title}>Checkout</h3>
      <p className={styles.CheckoutModal_text}>
        Is this table ready to seat new guests? This cannot be undone.
      </p>

      <button className={styles.CheckoutModal_btn} onClick={handleCheckout}>
        Ok
      </button>
    </Modal>
  );
};

export default CheckoutModal;
