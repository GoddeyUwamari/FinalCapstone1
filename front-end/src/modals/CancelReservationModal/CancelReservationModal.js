import React from "react";
import { Modal } from "../../components";

import styles from "./CancelReservationModal.module.css";

const CancelReservationModal = ({ reservation, show, handleClose }) => {
  const handleCancleReservation = () => {
    if (reservation && reservation.reservation_id)
      console.log("Cancle reservation", reservation.reservation_id);
  };

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      className={styles.CancelReservationModal}
    >
      <h3 className={styles.CancelReservationModal_title}>
        Cancel reservation
      </h3>
      <p className={styles.CancelReservationModal_text}>
        Are you sure you want to cancel{" "}
        <span>
          {reservation?.first_name} {reservation?.last_name}'s
        </span>{" "}
        reservation? This cannot be undone.
      </p>

      <button
        className={styles.CancelReservationModal_btn}
        onClick={handleCancleReservation}
      >
        Ok
      </button>
    </Modal>
  );
};

export default CancelReservationModal;
