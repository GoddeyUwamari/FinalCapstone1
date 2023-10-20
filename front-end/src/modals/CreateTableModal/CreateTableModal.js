import React from "react";
import Modal from "../../components/Modal";
import { Formik } from "formik";

import styles from "./CreateTableModal.module.css";
import { createTableValidationSchema } from "./validation";

const CreateTableModal = ({ show, handleClose }) => {
  const initialValues = {
    table_name: "",
    capacity: "",
  };

  const handleFormSubmission = (values) => console.log("Create table ", values);

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      className={styles.CreateTableModal}
    >
      <h3 className={styles.CreateTableModal_title}>Create Table</h3>
      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmission}
        validationSchema={createTableValidationSchema}
      >
        {({
          values,
          touched,
          errors,
          isValid,
          dirty,
          handleSubmit,
          handleChange,
          handleBlur,
        }) => (
          <form className={styles.CreateTableModal_form}>
            <div className={styles.CreateTableModal_form_row}>
              <label
                htmlFor="table_name"
                className={styles.CreateTableModal_form_row_label}
              >
                Table name
              </label>
              <input
                type="text"
                name="table_name"
                id="table_name"
                value={values.table_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={styles.CreateTableModal_form_row_input}
              />
              <p className="alert alert-danger">
                {touched.table_name ? errors.table_name : null}
              </p>
            </div>

            <div className={styles.CreateTableModal_form_row}>
              <label
                htmlFor="capacity"
                className={styles.CreateTableModal_form_row_label}
              >
                Capacity
              </label>
              <input
                type="text"
                name="capacity"
                id="capacity"
                value={values.capacity}
                onChange={handleChange}
                onBlur={handleBlur}
                className={styles.CreateTableModal_form_row_input}
              />
              <p className="alert alert-danger">
                {touched.capacity ? errors.capacity : null}
              </p>
            </div>

            <div className={styles.CreateTableModal_form_btns}>
              <button onClick={handleClose}>Close</button>
              <button
                onClick={handleSubmit}
                type="submit"
                disabled={!isValid || !dirty}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateTableModal;
