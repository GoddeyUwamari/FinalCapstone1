const knex = require("../db/connection");

const list = async () => {
  const res = await knex("reservations").select().from("reservations");
  return res;
};

const listByDate = async (date) => {
  const res = await knex("reservations")
    .whereRaw(`reservation_date='${date}'`)
    .select("*");

  return res;
};

const create = async (reservation) => {
  const res = await knex("reservations").insert(reservation).returning("*");

  return res;
};

const getById = async (reservation_id) => {
  const res = await knex("reservations")
    .whereRaw(`reservation_id='${reservation_id}'`)
    .select("*")
    .first();

  return res;
};

const search = async (mobile_number) => {
  const res = await knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");

  return res;
};

const changeStatus = async (status, reservation_id) => {
  const res = await knex("reservations")
    .whereRaw(`reservation_id=${reservation_id}`)
    .update("status", status)
    .returning("status");

  return res;
};

const updatedReservation = async (reservation_id, reservation) => {
  const {
    status,
    reservation_time,
    reservation_date,
    first_name,
    last_name,
    people,
    created_at,
    mobile_number,
  } = reservation;

  const res = await knex("reservations")
    .whereRaw(`reservation_id=${reservation_id}`)
    .update({
      status: status,
      reservation_time: reservation_time,
      reservation_date: reservation_date,
      first_name: first_name,
      last_name: last_name,
      people: people,
      created_at: created_at,
      mobile_number: mobile_number,
    })
    .returning("*");

  return res;
};

const remove = async (reservation_id) => {
  const result = await knex("reservations").where({ reservation_id }).del();
  return result;
};

module.exports = {
  list,
  listByDate,
  create,
  getById,
  changeStatus,
  updatedReservation,
  search,
  remove,
};
