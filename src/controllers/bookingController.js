const bookingService = require("../services/bookingService");

async function createBooking(req, res, next) {
    try {
        const userId = req.user.id;

        const booking = await bookingService.createBooking(userId, req.body);

        res.status(201).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createBooking,
}