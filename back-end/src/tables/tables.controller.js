const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { validationResult } = require("express-validator");
const service = require("./tables.service");
const getReservationById = require("../reservations/reservations.service");

const list = async (req, res) => {
  const tables = await service.list();
  const result = tables.sort((a, b) => (a.table_name > b.table_name ? 1 : -1));
  res.status(200).json({ data: result });
};

const createTable = async (req, res, next) => {
  try {
    const results = validationResult(req.body);

    if (!results.isEmpty()) {
      next({ status: 400, message: results.array() });
    }

    const { table_name, capacity } = req.body;

    // Check table capacity
    if (Number(capacity) < 1)
      next({ status: 400, message: "Table capacity should be greater than 1" });

    if (table_name.length < 2)
      next({ status: 400, message: "Invalid table name" });

    const table = await service.create(req.body.data);

    res.status(201).json({ data: table });
  } catch (error) {
    next(error);
  }
};

const tableExists = async (table_id, next) => {
  const table = await service.getById(table_id);
  if (!table) {
    next({
      status: 404,
      message: `Table ${table_id} does not exist`,
    });
  }
  next();
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

const checkReservation = async (reservation_id, next) => {
  const reservation = await getReservationById(reservation_id);
  if (!reservation)
    next({
      status: 404,
      message: `Reservation ${reservation_id} not found.`,
    });

  validateStatus(reservation.status, next);

  next();
};

const updateTableStatus = async (req, res) => {
  const { table_id } = req.params;

  const { reservation_id } = req.body.data;

  //checks if table exists
  tableExists(table_id, next);

  //checks if resevation exist
  checkReservation(reservation_id, next);

  const data = await service.update(table_id, reservation_id);
  res.json({ data });
};

const finishTable = async (req, res) => {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  //checks if table exists
  tableExists(table_id, next);

  //checks if resevation exist
  checkReservation(reservation_id, next);

  const data = await service.finish(table_id, reservation_id);
  res.json({ data });
};

const getTableById = async (req, res) => {
  const { table_id } = req.params;
  return await service.getById(table_id);
};

module.exports = {
  list: asyncErrorBoundary(list),
  createTable: asyncErrorBoundary(createTable),
  updateTableStatus: asyncErrorBoundary(updateTableStatus),
  finishTable: asyncErrorBoundary(finishTable),
  getTableById: asyncErrorBoundary(getTableById),
};
