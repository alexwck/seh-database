const   express = require("express"),
        router  = express.Router({ mergeParams: true });

const ctrlInfos = require("../../controllers/ingot/infos");

router.route("/")
    .put(ctrlInfos.updateInfo);

router.route("/edit")
    .get(ctrlInfos.updateInfoForm);

module.exports = router;