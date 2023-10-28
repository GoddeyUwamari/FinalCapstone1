const router = require("express").Router();
const controller = require("./reservations.controller");

// Get the list of reservations
router.route("/").get(controller.list);

// Get reservation by reservation_id
router.route("/:reservation_id").get(controller.getReservationById);

// Add reservation
router.route("/").post(controller.createReservation);

// Edit reservation
router.route("/:reservation_id").put(controller.editReservation);

// Delete reservation
router.route("/:reservation_id").delete(controller.removeReservation);

router.route("/:reservation_id/status").put(controller.updateStatus);

module.exports = router;
