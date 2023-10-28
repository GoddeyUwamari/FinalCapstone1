const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

const {
  getById: getReservationById,
} = require("../reservations/reservations.service");

const statusType = ["booked", "seated", "finished", "cancelled"];

const hasProperties = (...properties) => {
  return (res, req, next) => {
    const { data = {} } = res.body;
    try {
      properties.forEach((property) => {
        const value = data[property];

        if (!value) {
          const error = new Error(`A '${property}' property is required.`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};

const hasRequiredUpdateProperties = hasProperties("reservation_id");

// Table validation
const validateTableFormData = async (req, res, next) => {
  const table = req.body.data;

  if (!table) return next({ status: 400, messgae: "Invalid table" });

  const { table_name, capacity } = table;

  if (!table_name || table_name === "" || table_name.length < 2) {
    next({ status: 400, message: `Invalid table_name` });
  }

  if (!capacity || capacity === 0 || typeof capacity !== "number")
    next({ status: 400, message: `Invalid capacity` });

  return next();
};

// List all tables
const list = async (req, res) => {
  const tables = await service.list();
  const result = tables.sort((a, b) => (a.table_name > b.table_name ? 1 : -1));
  res.status(200).json({ data: result });
};

//Get table by id
const getTableById = async (req, res, next) => {
  const { table_id } = req.params;

  const data = await service.getById(table_id);

  if (data) return res.json({ data });
  else {
    next({ status: 404, message: `Table id ${table_id} does not exist` });
  }
};

// Create a new table
const createTable = async (req, res, next) => {
  try {
    const table = await service.create(req.body.data);

    return res.status(201).json({ data: table[0] });
  } catch (error) {
    return next(error);
  }
};

// Validate update status
const validateUpdateStatus = async (req, res, next) => {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  // Table validation
  const table = await service.getById(table_id);

  // Reservation validation
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
      message: `Reservation with ${reservation.people} people exceeds table capacity`,
    });
  }

  // Check if table is occupied to update status
  if (reservation.status === "booked") {
    if (table.reservation_id) {
      return next({
        status: 400,
        message: "Table is already occupied.",
      });
    }
    return next();
  }

  if (reservation.status === "seated") {
    return next({ status: 400, message: "Reservation is already seated" });
  }

  return next();
};

const updateTableStatus = async (req, res, next) => {
  const { table_id } = req.params;

  const { reservation_id } = req.body.data;

  const data = await service.update(table_id, reservation_id);

  if (data) return res.json({ data: { reservation_id: data } });
  else {
    return next({ status: 400, message: "Table does not exist" });
  }
};

const finishTable = async (req, res, next) => {
  const { table_id } = req.params;

  const table = await service.getById(table_id);

  if (!table) {
    return next({
      status: 404,
      message: `Table ${table_id} does not exist`,
    });
  }

  if (!table.reservation_id) {
    return next({
      status: 400,
      message: `Table is not occupied`,
    });
  }

  const data = await service.finish(table_id, table.reservation_id);

  return res.json({ data: { reservation_id: data } });
};

module.exports = {
  list: asyncErrorBoundary(list),
  createTable: [
    asyncErrorBoundary(validateTableFormData),
    asyncErrorBoundary(createTable),
  ],
  updateTableStatus: [
    hasRequiredUpdateProperties,
    asyncErrorBoundary(validateUpdateStatus),
    asyncErrorBoundary(updateTableStatus),
  ],
  finishTable: asyncErrorBoundary(finishTable),

  getTableById: asyncErrorBoundary(getTableById),
};
