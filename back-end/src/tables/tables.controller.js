const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { validationResult } = require("express-validator");
const service = require("./tables.service");
const getReservationById = require("../reservations/reservations.service");

const list = async (req, res) => {
  const tables = await service.list();
  const result = tables.sort((a, b) => (a.table_name > b.table_name ? 1 : -1));
  res.status(200).json({ data: result });
};

const tableExists = async (req, res, next) => {
  const { table_id } = req.params;
  const table = await service.getById(table_id);
  if (!table) {
    next({
      status: 404,
      message: `Table ${table_id} does not exist`,
    });
  }
  res.locals.table = table;
  next();
};

const reservationExists = async (req, res, next) => {
  const { reservation_id } = req.body.data;
  const reservation = await getReservationById(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({
    status: 404,
    message: `Reservation ${reservation_id} not found.`,
  });
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

const tableStatus = (req, res, next) => {
  const { reservation_id } = res.locals.table;
  if (!reservation_id) {
    next({
      status: 400,
      message: "Table is not occupied.",
    });
  }

  if (reservation_id) {
    next({
      status: 400,
      message: "Table is occupied.",
    });
  }
  next();
};

const reservationStatus = (req, res, next) => {
  const { status } = res.locals.reservation;
  if (status === "seated") {
    return next({
      status: 400,
      message: "Reservation is already seated.",
    });
  }
  next();
};

const updateTable = async (req, res) => {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  const data = await service.update(table_id, reservation_id);
  res.json({ data });
};

const finishTable = async (req, res) => {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  const data = await service.finish(table_id, reservation_id);
  res.json({ data });
};

const getTableById = async (req, res) => {
  const { table_id } = req.params;
  return await service.getById(table_id);
};

module.exports = {
  list: asyncErrorBoundary(list),
  createTable: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(createTable),
  ],
  updateTable: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    tableStatus(),
    reservationStatus(),
    asyncErrorBoundary(updateTable),
  ],
  finishTable: [
    asyncErrorBoundary(tableExists),
    tableStatus,
    asyncErrorBoundary(finishTable),
  ],
  getTableById: asyncErrorBoundary(getTableById),
};
