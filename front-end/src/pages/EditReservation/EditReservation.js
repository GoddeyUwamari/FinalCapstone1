import React from "react";
import { ReservationForm } from "../../components";
import { RESERVATION_MOCK_DATA } from "../../data/mockData";
import { useParams } from "react-router";

import styles from "./EditReservation.module.css";

const EditReservation = () => {
  const { reservation_id } = useParams();
  const data = RESERVATION_MOCK_DATA[reservation_id];
  return (
    <section className={styles.EditReservation}>
      <ReservationForm type={"edit"} data={data} />
    </section>
  );
};

export default EditReservation;
