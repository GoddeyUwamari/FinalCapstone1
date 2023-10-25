import React from "react";
import { toast } from "react-toastify";
import { Modal } from "../../components";
import { updateReservationStatus } from "../../utils/api";

import styles from "./CancelReservationModal.module.css";

const CancelReservationModal = ({
  reservation,
  show,
  handleClose,
  refresh,
}) => {
  const handleCancleReservation = React.useCallback(async () => {
    const controller = new AbortController();
    try {
      if (reservation && reservation.reservation_id) {
        return await updateReservationStatus(
          "cancelled",
          reservation.reservation_id,
          (isSuccessful) => {
            if (isSuccessful) {
              refresh();
              toast.success("Reservation has been cancelled successfully");
              handleClose();
            } else {
              throw new Error("Unable to cancel this reservatin");
            }
          },
          controller.signal
        );
      }
    } catch (error) {}
    return () => controller.abort();
  }, [reservation, handleClose, refresh]);

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
