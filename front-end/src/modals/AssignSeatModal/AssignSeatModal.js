import React from "react";
import { Modal } from "../../components";
import { Formik } from "formik";

import styles from "./AssignSeatModal.module.css";
import { assignSeatValidationSchema } from "./validation";

const AssignSeatModal = ({ reservation_id, tables, show, handleClose }) => {
  const initialValues = {
    seat: "",
  };

  const handleFormSubmit = (values) =>
    console.log("Assign seat: ", values, reservation_id);

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      className={styles.AssignSeatModal}
    >
      <h3 className={styles.AssignSeatModal_title}>Assign seat</h3>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={assignSeatValidationSchema}
      >
        {({ values, setFieldValue, handleSubmit, isValid, dirty }) => (
          <form onSubmit={handleSubmit} className={styles.AssignSeatModal_form}>
            <label htmlFor="seat" className={styles.AssignSeatModal_form_label}>
              Seat
            </label>
            <select
              value={values.seat}
              className={styles.AssignSeatModal_form_select}
              name="seat"
              id="seat"
              onChange={(e) => setFieldValue("seat", e.currentTarget.value)}
            >
              <option value="" hidden>
                Select seat
              </option>
              {tables?.map((item) => (
                <option value={`${item.table_name} - ${item.capacity}`}>
                  {item.table_name} - {item.capacity}
                </option>
              ))}
            </select>

            <button
              disabled={!isValid || !dirty}
              type="submit"
              className={styles.AssignSeatModal_form_btn}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
    </Modal>
  );
};

export default AssignSeatModal;
