const   express = require("express"),
        router  = express.Router({ mergeParams: true });

const ctrlOperators = require("../../controllers/ingot/operators");

router.route("/")
    .put(ctrlOperators.updateOperator);

router.route("/edit")
    .get(ctrlOperators.updateOperatorForm);

module.exports = router;