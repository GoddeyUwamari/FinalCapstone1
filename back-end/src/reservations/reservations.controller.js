const { validationResult } = require("express-validator");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const fns = require("date-fns");

const handleDateValidation = (date, next) => {
  const currentDate = new Date();
  const reservationDate = new Date(date);
  const isTuesday = fns.format(reservationDate, "eee") === "Tue";

  if (currentDate < reservationDate)
    next({ status: 400, message: "Invalid date" });

  if (isTuesday)
    next({ status: 400, message: "Reservations are closed on Tuesday" });
};

const handleTimeValidation = (time, next) => {
  const openingTime = fns.format(currentDate.setHours(10, 30), "hh:mm");
  const closingTime = fns.format(currentDate.setHours(21, 30), "hh:mm");

  if (time < openingTime || time > closingTime)
    next({
      status: 400,
      message: `Reservation hours is from ${openingTime}AM to ${closingTime}PM`,
    });
};

const validateStatus = (status, next) => {
  const statusType = ["booked", "seated", "finished", "cancelled"];
  if (statusType.includes(status)) {
    next();
  } else {
    next({
      status: 400,
      message: "Invalid status",
    });
  }
};

// List all reservations
// List reservations by date or mobile number
async function list(req, res, next) {
  try {
    const mobile_number = req.query.mobile_number;
    const date = req.query.reservation_date;

    if (mobile_number) {
      const result = await service.search(mobile_number);
      res.json({ data: result });
    }

    if (date) {
      const result = await service.listByDate(date);
      res.json({ data: result });
    }

    const reservations = await service.list();

    res.json({
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

    res.json({ data: reservation });
  } catch (error) {
    next(error);
  }
}

// Create reservation
async function createReservation(req, res, next) {
  try {
    // Validate the input using express-validator
    const results = validationResult(req.body);

    if (!results.isEmpty()) {
      next({ status: 400, message: results.array() });
    }

    const {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      status,
    } = req.body;

    // Date validation
    handleDateValidation(reservation_date, next);

    // Time validation
    handleTimeValidation(reservation_time, next);

    // Insert the reservation into the database
    const reservation = await service.create({
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      status,
    });

    res.status(201).json({ data: reservation });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
}

// Update reservation
async function editReservation(req, res, next) {
  try {
    // Validate the input using express-validator
    const results = validationResult(req.body);

    if (!results.isEmpty()) {
      next({ status: 400, message: results.array() });
    }

    const { reservation_id } = req.params;

    if (!reservation_id) {
      next({ status: 400, message: "Invalid data id" });
    }

    const {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      status,
    } = req.body;

    // Date validation
    handleDateValidation(reservation_date, next);

    // Time validation
    handleTimeValidation(reservation_time, next);

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

    res.status(200).json({ data: reservation });
  } catch (error) {
    next(error);
  }
}

// Delete reservation
async function removeReservation(req, res, next) {
  try {
    const { reservation_id } = req.params;
    if (!reservation_id) next({ status: 400, message: "Invalid data id" });

    // Delete the reservation from the database
    const deletedRows = await service.remove(reservation_id);

    if (!deletedRows) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(204).end(); // 204 No Content
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status, reservation_id } = req.params;

    validateStatus(status, next);

    if (!reservation_id)
      next({ status: 400, message: `Invalid reservation id` });

    const result = await service.changeStatus(status, reservation_id);

    res.status(200).json({ data: { status: result } });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  getReservationById: asyncErrorBoundary(getReservationById),
  createReservation: asyncErrorBoundary(createReservation),
  editReservation: asyncErrorBoundary(editReservation),
  removeReservation: asyncErrorBoundary(removeReservation),
  updateStatus: asyncErrorBoundary(updateStatus),
};
