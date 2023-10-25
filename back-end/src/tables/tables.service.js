const knex = require("../db/connection");

const create = async (tables) => {
  const res = await knex("tables").insert(tables).returning("*");
  return res;
};

const list = async () => {
  const res = await knex("tables").select().from("tables");
  return res;
};

const getById = async (table_id) => {
  const res = await knex("tables").select("*").where({ table_id }).first();

  return res;
};

const update = async (table_id, reservation_id) => {
  return await knex.transaction(async (trx) => {
    return await knex("reservations")
      .transacting(trx)
      .where({ reservation_id })
      .update({ status: "seated" })
      .returning("*")
      .then(() => {
        return knex("tables")
          .where({ table_id })
          .update({ reservation_id })
          .returning("*");
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
};

const finish = async (table_id, reservation_id) => {
  return await knex.transaction(async (trx) => {
    return await knex("reservations")
      .transacting(trx)
      .where({ reservation_id })
      .update({ status: "finished" })
      .returning("*")
      .then(() => {
        return knex("tables")
          .where({ table_id })
          .update({ reservation_id: null })
          .returning("*");
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
};

module.exports = {
  create,
  list,
  getById,
  update,
  finish,
};
