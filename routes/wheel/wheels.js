const   express = require("express"),
        router  = express.Router();

const ctrlWheels = require("../../controllers/wheel/wheels");

router.route("/")
    .get(ctrlWheels.getWheels)
    .post(ctrlWheels.createWheel)

router.route("/:wheel_id")
    .put(ctrlWheels.editWheel)
    .delete(ctrlWheels.deleteWheel)

// Allow Add and Delete only if added wrongly
router.route("/:wheel_id/ingots")
    .get(ctrlWheels.getIngots)
    .post(ctrlWheels.createIngot)
    .put(ctrlWheels.editWheelStatus)

router.route('/:wheel_id/ingots/:ingot_id')
    .delete(ctrlWheels.deleteIngot)


// NON AJAX
// From /wheels/new/:ingot_id to create the form from ingot show page
router.route("/new/:ingot_id")
    .get(ctrlWheels.createWhlForm)

// Also allow the ingot to be linked to the wheel database and delete as well
router.route("/:ingot_id")
    .post(ctrlWheels.createWhl)

module.exports = router;

