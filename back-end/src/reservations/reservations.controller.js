const { validationResult } = require("express-validator");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const fns = require("date-fns");

function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

const statusType = ["booked", "seated", "finished", "cancelled"];

// Date validation
const handleDateValidation = (req, res, next) => {
  const { reservation_date } = req.body.data;

  const currentDate = asDateString(new Date());
  const dateArr = reservation_date.split("-");
  const reservationDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
  const isTuesday = fns.format(reservationDate, "eee") === "Tue";

  if (reservationDate < currentDate)
    return next({ status: 400, message: "Invalid date" });

  if (isTuesday)
    return next({ status: 400, message: "Reservations are closed on Tuesday" });

  return next();
};

const getHourAndMinFromTime = (time) => {
  const timeArray = time.split(":");
  const hour = timeArray[0];
  const min = timeArray[1];
  return { hour, min };
};

const getActiveTime = () => {
  const currentTime = new Date().getTime();
  const openingTime = new Date().setHours(10, 30);
  const closingTime = new Date().setHours(21, 30);

  if (currentTime < openingTime) return openingTime;
  if (currentTime >= openingTime && currentTime <= closingTime)
    return currentTime;
  if (currentTime > closingTime) return closingTime;
};

// Time validation
const handleTimeValidation = (req, res, next) => {
  const { reservation_time } = req.body.data;

  const closingTime = new Date().setHours(21, 30);
  const timeObj = getHourAndMinFromTime(reservation_time);
  const reservationTime = new Date().setHours(timeObj.hour, timeObj.min);

  const activeTime = getActiveTime();

  if (reservationTime <= activeTime && reservationTime >= closingTime)
    return next({
      status: 400,
      message: `Reservation hours is from ${openingTime}AM to ${closingTime}PM`,
    });

  if (reservationTime) return next();
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
      return res.json({ data: result });
    }

    const reservations = await service.list();

    return res.json({
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
}

// Handler for single reservation by Id
async function getReservationById(req, res, next) {
  try {
    const { reservation_id } = req.params;

    const reservation = await service.getById(reservation_id);

    return res.json({ data: reservation });
  } catch (error) {
    return next(error);
  }
}

// Create reservation
async function createReservation(req, res, next) {
  try {
    // Validate the input using express-validator
    const results = validationResult(req.body);

    if (!results.isEmpty()) {
      return next({ status: 400, message: results.array() });
    }

    const reservation = req.body.data;
    if (!reservation) {
      return next({ status: 400, message: "No reservation" });
    }

    // Insert the reservation into the database
    const reservationData = await service.create(reservation);

    return res.status(201).json({ data: reservationData[0] });
  } catch (error) {
    return next(error);
  }
}

// Update reservation
async function editReservation(req, res, next) {
  try {
    // Validate the input using express-validator
    const results = validationResult(req.body);

    if (!results.isEmpty()) {
      return next({ status: 400, message: results.array() });
    }

    const { reservation_id } = req.params;

    if (!reservation_id) {
      return next({ status: 400, message: "Invalid data id" });
    }

    const {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      status,
    } = req.body.data;

    // Update the reservation in the database
    const reservation = await service.updatedReservation(reservation_id, {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      status,
    });

    return res.status(200).json({ data: reservation });
  } catch (error) {
    return next(error);
  }
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

    return res.status(204).end(); // 204 No Content
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
        message: "Invalid status",
      });
    }

    const result = await service.changeStatus(status, reservation_id);

    return res.status(200).json({ data: { status: result } });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  getReservationById: asyncErrorBoundary(getReservationById),
  createReservation: [
    asyncErrorBoundary(handleDateValidation),
    asyncErrorBoundary(handleTimeValidation),
    asyncErrorBoundary(createReservation),
  ],
  editReservation: [
    asyncErrorBoundary(handleDateValidation),
    asyncErrorBoundary(handleTimeValidation),
    asyncErrorBoundary(editReservation),
  ],
  removeReservation: asyncErrorBoundary(removeReservation),
  updateStatus: asyncErrorBoundary(updateStatus),
};
