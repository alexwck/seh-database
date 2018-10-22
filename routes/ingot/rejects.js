const   express = require("express"),
        router  = express.Router({ mergeParams: true });

const ctrlRejects = require("../../controllers/ingot/rejects");

router.route("/")
    .put(ctrlRejects.updateReject);

router.route("/edit")
    .get(ctrlRejects.updateRejectForm);

module.exports = router;