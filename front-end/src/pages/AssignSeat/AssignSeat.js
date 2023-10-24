import React from "react";
import { Formik } from "formik";
import { assignSeatValidationSchema } from "./validation";
import { useNavigate, useParams } from "react-router";
import { TABLE_MOCK_DATA } from "../../data/mockData";
import { uniqueId } from "lodash";

import styles from "./AssignSeat.module.css";

const AssignSeat = () => {
  const navigate = useNavigate();
  const { reservation_id } = useParams();

  const initialValues = {
    seat: "",
  };

  const handleFormSubmit = (values) =>
    console.log("Assign seat: ", values, reservation_id);

  const tables = TABLE_MOCK_DATA;

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
            <label htmlFor="seat" className={styles.AssignSeat_form_label}>
              Seat
            </label>
            <select
              value={values.seat}
              className={styles.AssignSeat_form_select}
              name="seat"
              id="seat"
              onChange={(e) => setFieldValue("seat", e.currentTarget.value)}
            >
              <option value="" hidden disabled>
                Select seat
              </option>
              {tables?.map((item) => (
                <option
                  key={uniqueId("seat-options_")}
                  value={`${item.table_name} - ${item.capacity}`}
                >
                  {item.table_name} - {item.capacity}
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
