import React from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { ReservationForm } from "../../components";
import { fetchReservationsById } from "../../utils/api";

import styles from "./EditReservation.module.css";

const EditReservation = () => {
  const { reservation_id } = useParams();

  const [reservation, setReservation] = React.useState(null);

  const handleFetchReservation = React.useCallback(async () => {
    try {
      const res = await fetchReservationsById(reservation_id);
      if (!res) throw new Error(res.error);

      return setReservation(res);
    } catch (error) {
      toast.error(error);
    }
  }, [reservation_id]);

  React.useEffect(
    () => handleFetchReservation(),
    [reservation_id, handleFetchReservation]
  );

  return (
    <section className={styles.EditReservation}>
      <ReservationForm type={"edit"} data={reservation} />
    </section>
  );
};

export default EditReservation;
