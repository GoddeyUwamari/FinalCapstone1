const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

// Sort reservation by time
const sortByTime = (array) => {
  const sortedArr = array.sort((t1, t2) => {
    const t1_time = getHourAndMinFromTime(t1.reservation_time);
    const t2_time = getHourAndMinFromTime(t2.reservation_time);

    if (t1_time.hour === t2_time.hour) {
      return t1_time.min - t2_time.min;
    } else {
      return t1_time.hour - t2_time.hour;
    }
  });

  return sortedArr;
};

// Date value in yyyy-mm-dd format
const dateSeperator = (value) => {
  const dateArray = value.split("-");
  const year = +dateArray[0];
  const month = +dateArray[1];
  const date = +dateArray[2];
  return { year, month, date };
};

// Time value in HH:MM format
const getHourAndMinFromTime = (time) => {
  const timeArray = time.split(":");
  const hour = timeArray[0];
  const min = timeArray[1];
  return { hour, min };
};

const statusType = ["booked", "seated", "finished", "cancelled"];

// Validate form values
const validateFormData = async (req, res, next) => {
  const reservation = req.body.data;

  if (!reservation) {
    return next({ status: 400, message: "Invalid Reservation data" });
  }

  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  } = reservation;

  if (!first_name || first_name === "") {
    return next({ status: 400, message: `Invalid first_name` });
  }

  if (!last_name || last_name === "") {
    return next({ status: 400, message: `Invalid last_name` });
  }

  if (!mobile_number || mobile_number === "") {
    return next({ status: 400, message: `Invalid mobile_number` });
  }

  // Reservation date start
  if (!reservation_date) {
    return next({ status: 400, message: `Invalid reservation_date` });
  }

  if (status === "" || status === "seated" || status === "finished") {
    return next({ status: 400, message: `Invalid status ${status}` });
  }

  const currentDate = new Date();
  const dateObj = dateSeperator(reservation_date);
  const reservationDate = new Date(
    dateObj.year,
    dateObj.month - 1,
    dateObj.date
  );
  const isTuesday = reservationDate.getDay() === 2;
  const isPast = reservationDate.getTime() < currentDate.getTime();

  if (isNaN(reservationDate)) {
    return next({ status: 400, message: `reservation_date is invalid` });
  }

  if (isPast)
    return next({
      status: 400,
      message:
        "Invalid date, you can only set date for the present and future ",
    });

  if (isTuesday)
    return next({ status: 400, message: "Reservations are closed on Tuesday" });

  // Reservation time vaildation
  if (!reservation_time) {
    return next({ status: 400, message: `Invalid reservation_time` });
  }

  const closingTime = new Date().setHours(21, 30);
  const timeObj = getHourAndMinFromTime(reservation_time);
  const reservationTime = new Date().setHours(timeObj.hour, timeObj.min);
  const openingTime = new Date().setHours(10, 30);

  if (isNaN(reservationTime)) {
    return next({ status: 400, message: `reservation_time is invalid` });
  }

  if (reservationTime < openingTime || reservationTime > closingTime)
    return next({
      status: 400,
      message: `Reservation hours is from ${openingTime}AM to ${closingTime}PM`,
    });

  if (!people || people === 0 || typeof people !== "number") {
    return next({ status: 400, message: `Invalid people` });
  }

  return next();
};

const reservationExists = async (req, res, next) => {
  const { reservation_id } = req.params;

  const reservation = await service.getById(reservation_id);
  if (!reservation) {
    return next({
      status: 404,
      message: `Invalid reservation_id ${reservation_id}`,
    });
  }

  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: "Cannot update a finished status",
    });
  }
  return next();
};

// List all reservations
// List reservations by date or mobile number
async function list(req, res, next) {
  try {
    const mobile_number = req.query.mobile_number;
    const date = req.query.date;

    if (mobile_number) {
      const result = await service.search(mobile_number);
      return res.json({ data: result });
    }

    if (date) {
      const result = await service.listByDate(date);

      const sorted = sortByTime(result);

      const reservations = sorted.filter(
        (reservation) => reservation.status !== "finished"
      );

      return res.json({ data: reservations });
    }

    const reservations = await service.list();
    const sortedReservations = sortByTime(reservations);

    return res.json({
      data: sortedReservations,
    });
  } catch (error) {
    next(error);
  }
}

// Handler for single reservation by Id
async function getReservationById(req, res, next) {
  const { reservation_id } = req.params;

  const reservation = await service.getById(reservation_id);

  if (reservation) return res.json({ data: reservation });
  else
    return next({
      status: 404,
      message: `Invalid reservation id ${reservation_id}`,
    });
}

// Create reservation
async function createReservation(req, res, next) {
  try {
    const reservation = req.body.data;
    if (!reservation) {
      return next({ status: 400, message: "No reservation" });
    }

    const reservationData = await service.create(reservation);

    return res.status(201).json({ data: reservationData[0] });
  } catch (error) {
    return next(error);
  }
}

// Update reservation
async function editReservation(req, res, next) {
  const { reservation_id } = req.params;

  if (!reservation_id) {
    return next({ status: 400, message: "Invalid data id" });
  }

  const reservationData = req.body.data;

  // Update the reservation in the database
  const reservation = await service.updateReservation(
    reservation_id,
    reservationData
  );

  res.status(200).json({ data: reservation[0] });
}

// Delete reservation
async function removeReservation(req, res, next) {
  try {
    const { reservation_id } = req.params;
    if (!reservation_id)
      return next({ status: 400, message: "Invalid data id" });

    // Delete the reservation from the database
    const deletedRows = await service.remove(reservation_id);

    if (!deletedRows) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { reservation_id } = req.params;
    const { status } = req.body.data;

    if (!reservation_id)
      return next({ status: 400, message: `Invalid reservation id` });

    if (!statusType.includes(status)) {
      return next({
        status: 400,
        message: "Status unknown",
      });
    }

    const result = await service.changeStatus(status, reservation_id);

    return res.status(200).json({ data: { status: result[0] } });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  getReservationById: asyncErrorBoundary(getReservationById),
  createReservation: [
    asyncErrorBoundary(validateFormData),
    asyncErrorBoundary(createReservation),
  ],
  editReservation: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(validateFormData),
    asyncErrorBoundary(editReservation),
  ],
  removeReservation: asyncErrorBoundary(removeReservation),
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(updateStatus),
  ],
};
