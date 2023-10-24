import React from "react";
import { Formik } from "formik";
import { reservationFormValidationSchema } from "./validation";

import styles from "./ReservationForm.module.css";
import { useNavigate } from "react-router";

const ReservationForm = ({ type, data }) => {
  const initialValues = {
    first_name: data?.first_name || "",
    last_name: data?.last_name || "",
    mobile_number: data?.mobile_number || "",
    reservation_date: data?.reservation_date || "",
    reservation_time: data?.reservation_time || "",
    people: data?.people || "",
  };

  const navigate = useNavigate();

  const currentDate = new Date();

  const handleSubmit = (values) => {
    const formValues = {
      ...values,
      status: "booked",
    };
    console.log(formValues);
  };
  return (
    <div className={styles.ReservationForm}>
      <h3 className={styles.ReservationForm_title}>
        {type === "edit" ? "Edit" : "Add"} Reservation
      </h3>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={reservationFormValidationSchema}
      >
        {({
          values,
          handleChange,
          isValid,
          dirty,
          touched,
          errors,
          handleBlur,
        }) => (
          <form onSubmit={handleSubmit} className={styles.ReservationForm_form}>
            <div className={styles.ReservationForm_form_row}>
              <label htmlFor="first_name">Firstname</label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                required
                value={values.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <p className="alert alert-danger">
                {touched.first_name ? errors.first_name : null}
              </p>
            </div>
            <div className={styles.ReservationForm_form_row}>
              <label htmlFor="last_name">Lastname</label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                required
                value={values.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <p className="alert alert-danger">
                {touched.last_name ? errors.last_name : null}
              </p>
            </div>
            <div className={styles.ReservationForm_form_row}>
              <label htmlFor="mobile_number">Phone</label>
              <input
                type="tel"
                name="mobile_number"
                id="mobile_number"
                required
                value={values.mobile_number}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <p className="alert alert-danger">
                {touched.mobile_number ? errors.mobile_number : null}
              </p>
            </div>
            <div className={styles.ReservationForm_form_row}>
              <label htmlFor="reservation_date">Date</label>
              <input
                type="date"
                name="reservation_date"
                id="reservation_date"
                min={currentDate}
                required
                value={values.reservation_date}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <p className="alert alert-danger">
                {touched.reservation_date ? errors.reservation_date : null}
              </p>
            </div>
            <div className={styles.ReservationForm_form_row}>
              <label htmlFor="reservation_time">Time</label>
              <input
                type="time"
                name="reservation_time"
                id="reservation_time"
                required
                value={values.reservation_time}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <p className="alert alert-danger">
                {touched.reservation_time ? errors.reservation_time : null}
              </p>
            </div>
            <div className={styles.ReservationForm_form_row}>
              <label htmlFor="people">People</label>
              <input
                type="number"
                name="people"
                id="people"
                required
                value={values.people}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <p className="alert alert-danger">
                {touched.people ? errors.people : null}
              </p>
            </div>

            <div className={styles.ReservationForm_form_btns}>
              {type === "edit" && (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className={styles.ReservationForm_form_btns_cancel}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!isValid || !dirty}
                className={styles.ReservationForm_form_btns_action}
              >
                {type === "edit" ? "Edit" : "Submit"}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default ReservationForm;
