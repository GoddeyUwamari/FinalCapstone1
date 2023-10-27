import React from "react";
import { toast } from "react-toastify";
import { updateReservationStatus } from "../../utils/api";

import styles from "./CancelReservationModal.module.css";
import Modal from "../../components/Modal/Modal";

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
    } catch (error) {
      toast.error(error.message);
    }
    return () => controller.abort();
  }, [reservation, handleClose, refresh]);

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      action={handleCancleReservation}
    >
      <h3 className={styles.CancelReservationModal_title}>
        Cancel reservation
      </h3>
      <p className={styles.CancelReservationModal_text}>
        Do you want to cancel this reservation? This cannot be undone.
      </p>
    </Modal>
  );
};

export default CancelReservationModal;
