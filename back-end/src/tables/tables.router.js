const router = require("express").Router();
const controller = require("./tables.controller");

// Get the list of tables
router.route("/").get(controller.list);

// Get table by table_id
router.route("/:table_id").get(controller.getTableById);

// Add new table
router.route("/").post(controller.createTable);

// Update table
router
  .route("/:table_id/seat")
  .put(controller.updateTableStatus)
  .delete(controller.finishTable);

module.exports = router;
