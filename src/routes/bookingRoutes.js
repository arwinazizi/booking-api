const express = require("express");
const bookingController = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, bookingController.createBooking);
router.get('/', protect, bookingController.getBookings);
router.put('/:id', protect, bookingController.updateBooking);
router.delete('/:id', protect, bookingController.deleteBooking);

module.exports = router;