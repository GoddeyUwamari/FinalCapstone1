const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { validationResult } = require("express-validator");
const service = require("./tables.service");

const {
  getById: getReservationById,
} = require("../reservations/reservations.service");

const statusType = ["booked", "seated", "finished", "cancelled"];

// List all tables
const list = async (req, res) => {
  const tables = await service.list();
  const result = tables.sort((a, b) => (a.table_name > b.table_name ? 1 : -1));
  res.status(200).json({ data: result });
};

//Get table by id
const getTableById = async (req, res, next) => {
  const { table_id } = req.params;

  if (!table_id) return next({ status: 400, message: "Table does not exist" });

  const data = await service.getById(table_id);
  return res.status(200).json({ data });
};

// Create a new table
const createTable = async (req, res, next) => {
  try {
    const results = validationResult(req.body);

    if (!results.isEmpty()) {
      return next({ status: 400, message: results.array() });
    }

    const { table_name, capacity } = req.body.data;

    // Check table capacity
    if (Number(capacity) < 1)
      return next({
        status: 400,
        message: "Table capacity should be greater than 1",
      });

    if (table_name.length < 2)
      return next({ status: 400, message: "Invalid table name" });

    const table = await service.create(req.body.data);

    return res.status(201).json({ data: table });
  } catch (error) {
    return next(error);
  }
};

// Check table and reservation properties
const validateTableAndReservation = async (req, res, next) => {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  // Table validation
  if (!table_id) return next({ status: 400, message: "Invalid table id" });

  const table = await service.getById(table_id);

  if (!table) {
    return next({
      status: 404,
      message: `Table ${table_id} does not exist`,
    });
  }

  // Reservation validation
  if (!reservation_id)
    return next({ status: 400, messgae: "Invalid reservation id" });

  const reservation = await getReservationById(reservation_id);

  if (!reservation)
    return next({
      status: 404,
      message: `Reservation ${reservation_id} not found.`,
    });

  // Validates reservation status
  if (!statusType.includes(reservation.status)) {
    return next({
      status: 400,
      message: "Invalid status",
    });
  }

  // validate table capacity
  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message: `Reservation with ${reservation.people} people exceeds table capaity`,
    });
  }

  // Check if table is occupied to update status
  if (reservation.status === "booked") {
    console.log("I got here");
    if (table.reservation_id) {
      return next({
        status: 400,
        message: "Table is already occupied.",
      });
    }
    return next();
  }

  // Check if table is occupied to finish status
  if (reservation.status === "seated") {
    console.log("Maybe I got here");
    if (!table.reservation_id) {
      return next({
        status: 400,
        message: "Table is not occupied.",
      });
    }
    return next();
  }

  return next();
};

const updateTableStatus = async (req, res, next) => {
  const { table_id } = req.params;

  const { reservation_id } = req.body.data;

  const data = await service.update(table_id, reservation_id);

  res.status(200).json({ data: { reservation_id: data } });
};

const finishTable = async (req, res, next) => {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  const data = await service.finish(table_id, reservation_id);
  res.json({ data: { reservation_id: data } });
};

module.exports = {
  list: asyncErrorBoundary(list),
  createTable: asyncErrorBoundary(createTable),
  updateTableStatus: [
    asyncErrorBoundary(validateTableAndReservation),
    asyncErrorBoundary(updateTableStatus),
  ],
  finishTable: [
    asyncErrorBoundary(validateTableAndReservation),
    asyncErrorBoundary(finishTable),
  ],
  getTableById: asyncErrorBoundary(getTableById),
};
