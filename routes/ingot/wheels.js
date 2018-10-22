const   express = require("express"),
        router  = express.Router({ mergeParams: true });

const ctrlWheels = require("../../controllers/ingot/wheels");

// Wheel here refers to maker, drawingno,  groove and wheellife
router.route("/")
    .put(ctrlWheels.updateWheel)

router.route("/edit")
    .get(ctrlWheels.updateWheelForm)

module.exports = router;