import React from "react";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router";
import { uniqueId } from "lodash";
import { toast } from "react-toastify";
import { assignSeatValidationSchema } from "./validation";
import {
  fetchTables,
  updateReservationStatus,
  updateTableStatus,
} from "../../utils/api";

import styles from "./AssignSeat.module.css";
import { dashboardPagePath } from "../../data/pageRoutes";

const AssignSeat = () => {
  const navigate = useNavigate();
  const { reservation_id } = useParams();

  const [tables, setTables] = React.useState(null);

  const initialValues = {
    table_id: "",
  };

  const handleFormSubmit = async (values) => {
    const controller = new AbortController();

    try {
      if (values) {
        return await updateTableStatus(
          reservation_id,
          values.table_id,
          async (isSuccessfull) => {
            if (isSuccessfull)
              return await updateReservationStatus(
                "seated",
                reservation_id,
                (isSubmitted) => {
                  if (isSubmitted) {
                    toast.success("Seat assigned successfully");
                    navigate(dashboardPagePath);
                  }
                },
                controller.signal
              );
          },
          controller.signal
        );
      }
    } catch (error) {
      toast.error(error.message);
    }

    return () => controller.abort();
  };

  const handleFetchTable = React.useCallback(async (signal) => {
    const res = await fetchTables(signal);
    if (res) {
      const tabledata = res.filter((item) => !item.reservation_id);
      setTables(tabledata);
    }
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    handleFetchTable(controller.signal);

    return () => controller.abort();
  }, [handleFetchTable]);

  return (
    <section className={styles.AssignSeat}>
      <h3 className={styles.AssignSeat_title}>Assign seat</h3>
      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={assignSeatValidationSchema}
      >
        {({ values, setFieldValue, handleSubmit, isValid, dirty }) => (
          <form onSubmit={handleSubmit} className={styles.AssignSeat_form}>
            <label htmlFor="table_id" className={styles.AssignSeat_form_label}>
              Seat
            </label>
            <select
              value={values.table_id}
              className={styles.AssignSeat_form_select}
              name="table_id"
              id="table_id"
              onChange={(e) => setFieldValue("table_id", e.currentTarget.value)}
            >
              <option value="" hidden disabled>
                Select seat
              </option>
              {tables?.map((table) => (
                <option key={uniqueId("seat-options_")} value={table.table_id}>
                  {table.table_name} - {table.capacity}
                </option>
              ))}
            </select>

            <div className={styles.AssignSeat_form_btns}>
              <button
                className={styles.AssignSeat_form_btns_cancel}
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                disabled={!isValid || !dirty}
                type="submit"
                className={styles.AssignSeat_form_btns_action}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AssignSeat;
