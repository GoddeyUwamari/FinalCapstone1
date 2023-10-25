const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { validationResult } = require("express-validator");
const service = require("./tables.service");

const {
  getById: getReservationById,
} = require("../reservations/reservations.service");

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

    const { table_name, capacity } = req.body.data;

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
  if (!table_id) next({ status: 490, message: "Invalid data id" });

  const table = await service.getById(table_id);
  if (!table) {
    next({
      status: 404,
      message: `Table ${table_id} does not exist`,
    });
  }
};

const validateStatus = (status, next) => {
  const statusType = ["booked", "seated", "finished", "cancelled"];
  if (!statusType.includes(status)) {
    next({
      status: 400,
      message: "Invalid status",
    });
  }
};

const checkReservation = async (reservation_id, table_id, next) => {
  if (!reservation_id) next({ status: 400, messgae: "Invalid reservation id" });

  const reservation = await getReservationById(reservation_id);

  if (!reservation)
    next({
      status: 404,
      message: `Reservation ${reservation_id} not found.`,
    });

  validateStatus(reservation.status, next);

  const table = await service.getById(table_id);
  if (!table.capacity)
    next({
      status: 404,
      message: `Table capacity not foung`,
    });

  if (table.capacity < reservation.people)
    next({
      status: 400,
      message: `Reservation with ${reservation.people} people exceeds table capaity`,
    });
};

const updateTableStatus = async (req, res, next) => {
  const { table_id } = req.params;

  const { reservation_id } = req.body.data;

  //checks if table exists
  tableExists(table_id, next);

  //checks if resevation exist
  checkReservation(reservation_id, table_id, next);

  const data = await service.update(table_id, reservation_id);

  res.status(200).json({ data: { reservation_id: data } });
};

const finishTable = async (req, res, next) => {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  //checks if table exists
  tableExists(table_id, next);

  //checks if resevation exist
  checkReservation(reservation_id, table_id, next);

  const data = await service.finish(table_id, reservation_id);
  res.json({ data: { reservation_id: data } });
};

const getTableById = async (req, res, next) => {
  const { table_id } = req.params;
  if (!table_id) next({ status: 400, message: "Table does not exist" });
  const data = await service.getById(table_id);
  res.status(200).json({ data });
};

module.exports = {
  list: asyncErrorBoundary(list),
  createTable: asyncErrorBoundary(createTable),
  updateTableStatus: asyncErrorBoundary(updateTableStatus),
  finishTable: asyncErrorBoundary(finishTable),
  getTableById: asyncErrorBoundary(getTableById),
};
