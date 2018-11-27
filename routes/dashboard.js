const express   = require("express"),
      router    = express.Router();

const db        = require("../models");

//  DASHBOARD STATIC ROUTE
router.get("/", function(req, res){
      res.render("dashboard");
});

module.exports = router;