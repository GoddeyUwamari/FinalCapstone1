import React from "react";
import { toast } from "react-toastify";
import { ReservationForm } from "../../components";
import { fetchReservations } from "../../utils/api";

import styles from "./AddReservation.module.css";

const AddReservation = () => {
  const handleFetchReservations = React.useCallback(async (signal) => {
    try {
      const res = await fetchReservations(signal);
      if (!res) throw new Error(res.error);
    } catch (error) {
      toast.error(error);
    }
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    handleFetchReservations(controller.signal);

    return () => controller.abort();
  }, [handleFetchReservations]);

  return (
    <section className={styles.AddReservation}>
      <ReservationForm refresh={handleFetchReservations} />
    </section>
  );
};

export default AddReservation;
