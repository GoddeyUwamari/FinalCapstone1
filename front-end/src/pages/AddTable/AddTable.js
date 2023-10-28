import React from "react";
import { useNavigate } from "react-router";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { createTableValidationSchema } from "./validation";
import { postTable } from "../../utils/api";

import styles from "./AddTable.module.css";
import { dashboardPagePath } from "../../data/pageRoutes";

const AddTable = () => {
  const navigate = useNavigate();
  const initialValues = {
    table_name: "",
    capacity: "",
  };

  const handleFormSubmission = async (values) => {
    try {
      if (values)
        return await postTable(values, (isSuccessful) => {
          if (isSuccessful) {
            toast.success("Table added successfully");
            navigate(dashboardPagePath);
          }
        });
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <section className={styles.AddTable}>
      <h3 className={styles.AddTable_title}>Create Table</h3>
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
          <form className={styles.AddTable_form}>
            <div className={styles.AddTable_form_row}>
              <label
                htmlFor="table_name"
                className={styles.AddTable_form_row_label}
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
                className={styles.AddTable_form_row_input}
              />
              <p className="alert alert-danger">
                {touched.table_name ? errors.table_name : null}
              </p>
            </div>

            <div className={styles.AddTable_form_row}>
              <label
                htmlFor="capacity"
                className={styles.AddTable_form_row_label}
              >
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                id="capacity"
                value={values.capacity}
                onChange={handleChange}
                onBlur={handleBlur}
                className={styles.AddTable_form_row_input}
              />
              <p className="alert alert-danger">
                {touched.capacity ? errors.capacity : null}
              </p>
            </div>

            <div className={styles.AddTable_form_btns}>
              <button type="button" onClick={() => navigate(-1)}>
                Cancel
              </button>
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
    </section>
  );
};

export default AddTable;
