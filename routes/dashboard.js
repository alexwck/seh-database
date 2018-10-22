const express   = require("express"),
      router    = express.Router();

const db        = require("../models");

router.get("/", function(req, res){
      res.render("dashboard");
});

module.exports = router;