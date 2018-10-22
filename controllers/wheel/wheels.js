const   db      = require("../../models");

// INDEX ROUTE
exports.getWheels = (req, res) => {
      let perPage = 20;
      let pageQuery = parseInt(req.query.page, 10);
      let pageNumber = pageQuery ? pageQuery : 1;
      
      let noMatch = null;

      // Admin
      if(req.user && req.user.isAdmin){
            if(req.query.search){
                  const regex = new RegExp(escapeRegex(req.query.search), 'gi');
                  db.Wheel.find({"serialNo": regex}, "serialNo batchNo")
                  .skip((perPage*pageNumber)-perPage)
                  .limit(perPage)
                  .sort({"serialNo":1})
                  .exec(function(err, data){
                        db.Wheel.countDocuments().exec(function(err, count){
                              if(err){
                                    req.flash("error","Something wrong when getting the list of wheels");
                                    res.redirect("/wheels");
                                    console.log(err);
                              }
                              else{
                                    if(data.length < 1){
                                          noMatch = "No wheel serial number match that query, please try again.";
                                    }
                                    res.render("wheel/index", { 
                                          data: data, 
                                          tab: "wheels",
                                          current: pageNumber,
                                          pages: Math.ceil(count/ perPage),
                                          search: req.query.search,
                                          noMatch: noMatch
                                    });
                              }
                        });     
                  })      
            } else{
                  // If no do search query
                  db.Wheel.find({}, "serialNo batchNo")
                  .skip((perPage*pageNumber)-perPage)
                  .limit(perPage)
                  .sort({"serialNo":1})
                  .exec(function(err, data){  
                        db.Wheel.countDocuments().exec(function(err, count){
                              if(err){
                                    req.flash("error","Something wrong when getting the list of wheels");
                                    res.redirect("/wheels");
                                    console.log(err);
                              }
                              else{
                                    res.render("wheel/index", { 
                                          data: data, 
                                          tab: "wheels",
                                          current: pageNumber,
                                          pages: Math.ceil(count/ perPage),
                                          search: false,
                                          noMatch: noMatch
                                    });
                              }
                        });       
                  })      
            }
      }
      else{
            // Not Admin
            // If there is a search query
            if(req.query.search){
                  const regex = new RegExp(escapeRegex(req.query.search), 'gi');
                  db.Wheel.find({ $and: [ { serialNo: regex } , { isCompleted: false } ] }, "serialNo batchNo")
                  .skip((perPage*pageNumber)-perPage)
                  .limit(perPage)
                  .sort({"serialNo":1})
                  .exec(function(err, data){
                        db.Wheel.countDocuments().exec(function(err, count){
                              if(err){
                                    req.flash("error","Something wrong when getting the list of wheels");
                                    res.redirect("/wheels");
                                    console.log(err);
                              }
                              else{
                                    if(data.length < 1){
                                          noMatch = "No wheel serial number match that query, please try again.";
                                    }
                                    res.render("wheel/index", { 
                                          data: data,
                                          count: ingotsCount, 
                                          tab: "wheels",
                                          current: pageNumber,
                                          pages: Math.ceil(count/ perPage),
                                          search: req.query.search,
                                          noMatch: noMatch
                                    });
                              }
                        });     
                  })      
            } else{
                  // If no do search query
                  db.Wheel.find({ isCompleted: false }, "serialNo batchNo")
                  .skip((perPage*pageNumber)-perPage)
                  .limit(perPage)
                  .sort({"serialNo":1})
                  .exec(function(err, data){  
                        db.Wheel.countDocuments().exec(function(err, count){
                              if(err){
                                    req.flash("error","Something wrong when getting the list of wheels");
                                    res.redirect("/wheels");
                                    console.log(err);
                              }
                              else{
                                    res.render("wheel/index", { 
                                          data: data,
                                          tab: "wheels",
                                          current: pageNumber,
                                          pages: Math.ceil(count/ perPage),
                                          search: false,
                                          noMatch: noMatch
                                    });
                              }
                        });       
                  })      
            }
      } 
};

// CREATE ROUTE
exports.createWheel = function (req, res) {
      req.body.serialNo = req.sanitize(req.body.serialNo);
      req.body.batchNo = req.sanitize(req.body.batchNo);

      let newSerialBatch = {
            serialNo: req.body.serialNo,
            batchNo: req.body.batchNo
      };
      db.Wheel.create(newSerialBatch, function(err, wheel){
            if (!wheel || err) {
                  req.flash("error","Something went wrong when creating the wheel serial no and batch");
            } else{
                  res.json({wheel:wheel, user:req.user}) 
            }
      })
};

// UPDATE ROUTE
exports.editWheel = function (req, res){
      let editSerialBatch = {
            serialNo: req.body.serialNo,
            batchNo: req.body.batchNo
      };
      db.Wheel.findByIdAndUpdate(req.params.wheel_id, editSerialBatch, {new: true}, function(err, wheel){
            if (!wheel || err) {
                  req.flash("error","Something went wrong when updating wheel");
            } else{
                  res.json({wheel:wheel, user:req.user}) 
            }
      })
}

// DELETE ROUTE
exports.deleteWheel = function (req, res){
      db.Wheel.findByIdAndRemove(req.params.wheel_id, function(err, wheel){
            if (!wheel || err) {
                  req.flash("error","Something went wrong when deleting wheel");
            } else{
                  res.json(wheel)
            }
      })
}

// GET INGOT INDEX ROUTE
exports.getIngots = (req, res) => {
      db.Wheel.find({"_id":req.params.wheel_id})
      .populate('ingots', 'order lot')
      .exec()
      .then((data)=>{
            res.render("wheel/ingotLists", { 
                  data: data,
                  tab: "wheels" 
            });
      })
      .catch((err)=>{
            req.flash("error","Something wrong when getting the list of ingots for this wheel");
            res.redirect("/wheels");
      })
};

// CREATE ROUTE
exports.createIngot = function (req, res) {
      req.body.order = req.sanitize(req.body.order);
      req.body.lot = req.sanitize(req.body.lot);
      
      db.Ingot.findOne({ "order": req.body.order, "lot": req.body.lot },{"order":1, "lot":1, "_id":1}).exec(function (err, ingot) {
            console.log(ingot)
            if (err){
                  res.status(500).end();
            } else if(!ingot){
                  res.status(404).end();
            }
            db.Wheel.findOneAndUpdate({"_id":req.params.wheel_id}, { $push: { ingots: ingot._id} },{new: true}, function(err, addIngot){
                  if (!addIngot || err) {
                        throw new Error("Something went wrong when adding ingot");
                  } else{
                        res.json(ingot);
                  }
            })
      });
};

exports.deleteIngot = function(req, res){
      db.Wheel.findOneAndUpdate({"_id": req.params.wheel_id}, { $pull: { "ingots": req.params.ingot_id } } , function(err, removeIngot){
            if (!removeIngot || err) {
                  req.flash("error","Something went wrong when deleting wheel");
            }
            res.json(removeIngot);
      })
}

exports.editWheelStatus = function (req, res){
      db.Wheel.findOne({"_id": req.params.wheel_id}, function(err, doc){
            db.Wheel.findOneAndUpdate({"_id": req.params.wheel_id}, {$set: {isCompleted: !doc.isCompleted} }, {new: true}, function(err, status){
                  if (!status || err) {
                        req.flash("error","Something went wrong when updating wheel status");
                  } else{
                        res.json(status);
                  }
            })
      })
}

// NON AJAX
// CREATE WHEEL FORM
exports.createWhlForm = function (req, res) {
      db.Ingot.findById(req.params.ingot_id, { _id: 1, order:1, lot:1}, function (err, ingot) {
          if (!ingot || err) {
                req.flash("error","Cannot find ingot with that ID");
                res.redirect("/ingots");
          } else {
              res.render("wheel/new", { ingot });
          }
      });
};

// CREATE WHEEL
exports.createWhl = function (req, res) {
      req.body.serialNo = req.sanitize(req.body.serialNo);
      req.body.batchNo = req.sanitize(req.body.batchNo);

      let newSerialBatch = {
            serialNo: req.body.serialNo,
            batchNo: req.body.batchNo
      };

      db.Ingot.findById(req.params.ingot_id, {_id:1, order:1, lot:1}, function(err, ingot){
            if(!ingot || err){
                  req.flash("error","Could not find ingot before adding the information");
                  res.redirect("/ingots");
            }
            db.Wheel.findOne(newSerialBatch, function(err, wheel){
                  if(!wheel || err){
                        req.flash("error","Something went wrong when finding the wheel");
                        res.redirect("/ingots");
                  }
                  if( wheel === null){
                        db.Wheel.create(newSerialBatch, function(err, wheel){
                              if (!wheel || err) {
                                    req.flash("error","Something went wrong when creating the wheel serial no and batch");
                                    res.redirect(`/ingots/${req.params.ingot_id}`);
                              }
                              wheel.ingots.push(ingot._id);
                              wheel.save()
                              .then( (data)=>{
                                    res.redirect(`/ingots/${req.params.ingot_id}`);  
                              })
                              .catch((err)=>{
                                    req.flash("error","Something went wrong when linking wheel serial no and batch to the ingot");
                                    res.redirect(`/ingots/${req.params.ingot_id}`);
                              })
                        })
                  } else{
                        wheel.ingots.push(ingot._id);
                        wheel.save()
                        .then( (data)=>{
                              res.redirect(`/ingots/${req.params.ingot_id}`);  
                        })
                        .catch((err)=>{
                              req.flash("error","Something went wrong when linking wheel serial no and batch to the ingot");
                              res.redirect(`/ingots/${req.params.ingot_id}`);
                        })
                  }
            })
      })
};

exports.deleteWhlFrmIngot = function (req, res) {
      db.Ingot.findById(req.params.ingot_id, {_id:1, order:1, lot:1}, function(err, ingot){
            if(!ingot || err){
                  req.flash("error","Cannot find ingot with that ID to delete");
                  res.redirect("/ingots");
            }
            db.Wheel.findOneAndUpdate({"ingots": ingot._id}, { $pull: { "ingots": ingot._id } } , function(err, removeIngot){
                  if (!removeIngot || err) {
                        req.flash("error","Something went wrong when deleting ingot from the wheel");
                        res.redirect(`/ingots/${req.params.ingot_id}`);
                  }
                  req.flash("success","Successfully remove ingot from the wheel");
                  res.redirect(`/ingots/${req.params.ingot_id}`);
            })
      })
};

function escapeRegex(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };