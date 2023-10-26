import React from "react";
import { ReservationForm } from "../../components";

import styles from "./AddReservation.module.css";

const AddReservation = () => {
  return (
    <section className={styles.AddReservation}>
      <ReservationForm />
    </section>
  );
};

export default AddReservation;
