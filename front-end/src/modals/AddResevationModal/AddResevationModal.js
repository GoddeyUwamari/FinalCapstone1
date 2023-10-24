import React from "react";
import Modal from "../../components/Modal";

import styles from "./AddResevationModal.module.css";
import { ReservationForm } from "../../components";

const AddResevationModal = ({ show, handleClose, type, data }) => {
  return (
    <Modal
      show={show}
      handleClose={handleClose}
      className={styles.AddResevationModal}
    >
      <ReservationForm />
    </Modal>
  );
};

export default AddResevationModal;
