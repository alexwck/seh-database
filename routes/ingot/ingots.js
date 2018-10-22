const   express = require("express"),
        router  = express.Router();

const ctrlIngots = require("../../controllers/ingot/ingots");
const ctrlWheels = require("../../controllers/wheel/wheels");

// Get ingots to show the full list
// Show ingots to show more information about it

router.route("/")
    .get(ctrlIngots.getIngots);

router.route("/:ingot_id")
    .get(ctrlIngots.showIngot)
    .delete(ctrlWheels.deleteWhlFrmIngot);
    
module.exports = router;