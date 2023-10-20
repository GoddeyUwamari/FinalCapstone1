import React from "react";
import { Modal } from "../../components";
import { Formik } from "formik";
import { uniqueId, capitalize } from "lodash";

import styles from "./UpdateStatusModal.module.css";
import { updateStatusValidationSchema } from "./validation";

const UpdateStatusModal = ({ data, show, handleClose }) => {
  const initialValues = {
    status: "",
  };

  const handleFormSubmit = (values) => {
    console.log("Update status", values, data.reservation_id);
  };

  const statusOptions = ["seated", "finished"];

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      className={styles.UpdateStatusModal}
    >
      <h3 className={styles.UpdateStatusModal_title}>Update status</h3>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={updateStatusValidationSchema}
      >
        {({ values, handleChange, handleSubmit, dirty, isValid }) => (
          <form
            className={styles.UpdateStatusModal_form}
            onSubmit={handleSubmit}
          >
            <label
              htmlFor="status"
              className={styles.UpdateStatusModal_form_label}
            >
              Status
            </label>
            <select
              name="status"
              className={styles.UpdateStatusModal_form_select}
              id="status"
              value={values.status}
              onChange={handleChange}
            >
              <option value="" hidden disabled>
                Select status
              </option>
              {statusOptions.map((item) => (
                <option value={item} key={uniqueId("status_")}>
                  {capitalize(item)}
                </option>
              ))}
            </select>

            <button
              disabled={!isValid || !dirty}
              type="submit"
              className={styles.UpdateStatusModal_form_btn}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
    </Modal>
  );
};

export default UpdateStatusModal;
