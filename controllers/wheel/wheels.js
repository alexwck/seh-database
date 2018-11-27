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
                  db.Wheel.find({"serialNo": regex})
                  .skip((perPage*pageNumber)-perPage)
                  .limit(perPage)
                  .sort({"isCompleted":-1,"created_at":-1})
                  .exec( (err, data) => {
                        try {
                              if(data.length < 1) noMatch = "No wheel serial number match that query, please try again.";
                              
                              db.Wheel.countDocuments().exec( async (err, count) => {
                                    ingotCount = await countIngotEachWhl(data);
                                    // uniqueMachines = await findUniqueMcEachWhl(data);
                                    newArrObj = await includeIngotCountAndUniqueMachines(data, ingotCount);

                                    res.render("wheel/index", { 
                                          data: newArrObj, 
                                          tab: "wheels",
                                          current: pageNumber,
                                          pages: Math.ceil(count/ perPage),
                                          search: req.query.search,
                                          noMatch: noMatch
                                    });
                              });       
                        } catch (err) {
                              req.flash("error","Something wrong when getting the list of wheels");
                              res.redirect("/wheels");
                        } 
                  })      
            } else{
                  // If no do search query
                  db.Wheel.find({})
                  .skip((perPage*pageNumber)-perPage)
                  .limit(perPage)
                  .sort({"isCompleted":-1,"created_at":-1})
                  .exec( (err, data) => { 
                        try {
                              db.Wheel.countDocuments().exec( async (err, count) => {
                                    ingotCount = await countIngotEachWhl(data);
                                    // uniqueMachines = await findUniqueMcEachWhl(data);
                                    newArrObj = await includeIngotCountAndUniqueMachines(data, ingotCount);

                                    res.render("wheel/index", { 
                                          data: newArrObj, 
                                          tab: "wheels",
                                          current: pageNumber,
                                          pages: Math.ceil(count/ perPage),
                                          search: false,
                                          noMatch: noMatch
                                    });
                              });            
                        } catch (err) {
                              req.flash("error","Something wrong when getting the list of wheels");
                              res.redirect("/wheels");
                        } 
                  })      
            }
      }
      else{
            // Not Admin
            // If there is a search query
            if(req.query.search){
                  const regex = new RegExp(escapeRegex(req.query.search), 'gi');
                  db.Wheel.find({ $and: [ { serialNo: regex } , { isCompleted: false } ] })
                  .skip((perPage*pageNumber)-perPage)
                  .limit(perPage)
                  .sort({"machine":1})
                  .exec( (err, data) => {
                        try {
                              if(data.length < 1) noMatch = "No wheel serial number match that query, please try again.";

                              db.Wheel.countDocuments().exec( async (err, count) => {
                                    ingotCount = await countIngotEachWhl(data);
                                    // uniqueMachines = await findUniqueMcEachWhl(data);
                                    newArrObj = await includeIngotCountAndUniqueMachines(data, ingotCount);

                                    res.render("wheel/index", { 
                                          data: newArrObj,
                                          tab: "wheels",
                                          current: pageNumber,
                                          pages: Math.ceil(count/ perPage),
                                          search: req.query.search,
                                          noMatch: noMatch
                                    });
                              });     
                        } catch (err) {
                              req.flash("error","Something wrong when getting the list of wheels");
                              res.redirect("/wheels");
                        }
                  })      
            } else{
                  // If no do search query
                  db.Wheel.find({ isCompleted: false })
                  .skip((perPage*pageNumber)-perPage)
                  .limit(perPage)
                  .sort({"machine":1})
                  .exec( (err, data) => {
                        try {
                              db.Wheel.countDocuments().exec( async (err, count) => {
                                    ingotCount = await countIngotEachWhl(data);
                                    // uniqueMachines = await findUniqueMcEachWhl(data);
                                    newArrObj = await includeIngotCountAndUniqueMachines(data, ingotCount);

                                    res.render("wheel/index", { 
                                          data: newArrObj,
                                          tab: "wheels",
                                          current: pageNumber,
                                          pages: Math.ceil(count/ perPage),
                                          search: false,
                                          noMatch: noMatch
                                    });
                              });         
                        } catch (err) {
                              req.flash("error","Something wrong when getting the list of wheels");
                              res.redirect("/wheels");
                        }  
                       
                  })      
            }
      } 
};

// CREATE ROUTE
exports.createWheel = (req, res) => {
      req.body.serialNo = req.sanitize(req.body.serialNo);
      req.body.batchNo = req.sanitize(req.body.batchNo);
      req.body.machine = req.sanitize(req.body.machine)

      let newSerialBatch = {
            serialNo: req.body.serialNo,
            batchNo: req.body.batchNo,
            machine: req.body.machine
      };
      db.Wheel.create(newSerialBatch, (err, wheel) => {
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            if(!wheel) return res.status(404).json({ error: 'Something went wrong when creating the wheel serial no and batch' });
            res.json({wheel:wheel, user:req.user}) 
      })
};

// UPDATE ROUTE
exports.editWheel = (req, res) => {
      let edit ={}
      if(!req.body.machine) {
            edit = {
                  serialNo: req.body.serialNo,
                  batchNo: req.body.batchNo
            }
      } else{
            edit = {
                  machine: req.body.machine
            }
      }
      db.Wheel.findByIdAndUpdate(req.params.wheel_id, edit, {new: true}, (err, wheel)=>{
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            if(!wheel) return res.status(404).json({ error: 'Something went wrong when updating wheel' });
            res.json({wheel:wheel, user:req.user}) 
      })
}

// DELETE ROUTE
exports.deleteWheel = (req, res) => {
      db.Wheel.findByIdAndRemove(req.params.wheel_id, (err, wheel) =>{
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            if(!wheel) return res.status(404).json({ error: 'Something went wrong when deleting wheel' });
            res.json(wheel)
      })
}

// GET INGOT INDEX ROUTE
exports.getIngots = (req, res) => {
      db.Wheel.find({"_id":req.params.wheel_id})
      .populate('ingots', 'order lot')
      .exec()
      .then((data)=>{
            // Render show template
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
exports.createIngot = (req, res) => {
      req.body.order = req.sanitize(req.body.order);
      req.body.lot = req.sanitize(req.body.lot);
      
      db.Ingot.findOne({ "order": req.body.order, "lot": req.body.lot },{"order":1, "lot":1, "_id":1}).exec( (err, ingot) => {
            if (err) return res.status(500).json({ error: 'Internal Server Error' });
            if(!ingot) return res.status(404).json({ error: 'No such Ingot Exists!' });
            db.Wheel.findOne({"ingots": ingot._id}).exec( (err, foundIngot) => {
                  if(foundIngot === null){
                        db.Wheel.findOneAndUpdate({"_id":req.params.wheel_id}, { $push: { ingots: ingot._id} },{new: true}, (err, addIngot) =>{
                              if(err) return res.status(500).json({ error: 'Internal Server Error' });   
                              if(!addIngot) return res.status(404).json({ error: 'Something went wrong when adding ingot' });
                              res.json(ingot);
                        })
                  } else{
                        res.status(404).json({ error: 'You cannot add the same ingot twice' });
                  }
            })
      });
};

exports.deleteIngot = (req, res) => {
      db.Wheel.findOneAndUpdate({"_id": req.params.wheel_id}, { $pull: { "ingots": req.params.ingot_id } }, { "new": true} , (err, removeIngot) =>{
            if(err) return res.status(500).json({ error: 'Internal Server Error' });   
            if(!removeIngot) return res.status(404).json({ error: 'Something went wrong when deleting wheel' });
            res.json(removeIngot);
      })
}

exports.editWheelStatus = (req, res) =>{
      db.Wheel.findOne({"_id": req.params.wheel_id}, (err, doc) =>{
            db.Wheel.findOneAndUpdate({"_id": req.params.wheel_id}, {$set: {isCompleted: !doc.isCompleted} }, {new: true}, (err, status) =>{
                  if(err) return res.status(500).json({ error: 'Internal Server Error' });   
                  if(!status) return res.status(404).json({ error: 'Something went wrong when updating wheel status' });
                  res.json(status);
            })
      })
}

// NON AJAX
// CREATE WHEEL FORM
exports.createWhlForm = (req, res) => {
      db.Ingot.findById(req.params.ingot_id, { _id: 1, order:1, lot:1}, (err, ingot) => {
          if (!ingot || err) {
                req.flash("error","Cannot find ingot with that ID");
                res.redirect("/ingots");
          } else {
              res.render("wheel/new", { ingot });
          }
      });
};

// CREATE WHEEL
exports.createWhl = (req, res) => {
      req.body.serialNo = req.sanitize(req.body.serialNo);
      req.body.batchNo = req.sanitize(req.body.batchNo);

      let newSerialBatch = {
            serialNo: req.body.serialNo,
            batchNo: req.body.batchNo
      };

      // Before adding the wheel. make sure that the ingot is available
      db.Ingot.findById(req.params.ingot_id, {_id:1, order:1, lot:1}, (err, ingot) =>{
            if(!ingot || err){
                  req.flash("error","Could not find ingot before adding the information");
                  res.redirect("/ingots");
            }
            // Find whether the wheel exists
            db.Wheel.findOne(newSerialBatch, (err, wheel) => {
                  if(!wheel || err){
                        req.flash("error","Something went wrong when finding the wheel");
                        res.redirect("/ingots");
                  }
                  if( wheel === null){
                        db.Wheel.create(newSerialBatch, (err, wheel) =>{
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

exports.deleteWhlFrmIngot = (req, res) => {
      // Before delete the wheel. make sure that the ingot is available
      db.Ingot.findById(req.params.ingot_id, {_id:1, order:1, lot:1}, (err, ingot) =>{
            if(!ingot || err){
                  req.flash("error","Cannot find ingot with that ID to delete");
                  res.redirect("/ingots");
            }
            // Find whether the wheel exists with that ingot id or not
            db.Wheel.findOneAndUpdate({"ingots": ingot._id}, { $pull: { "ingots": ingot._id } } , (err, removeIngot)=>{
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

function countIngotEachWhl(data){
      let ingotCounts = [], total = 0;
      data.forEach((val) =>{
            val.ingots.forEach( (val) => {
                  total ++;
            })
            ingotCounts.push(total);
            total = 0;
      })
      return ingotCounts;
}

// async function findUniqueMcEachWhl(data){
//       let machinesInAllWhl=[];
//       for ({ingots} of data){
//             let machinesInEachWhl = []
//             for(i of ingots){
//                   let {grinding} = await db.Ingot.findOne({_id: i})
//                   machinesInEachWhl.push(grinding.machine)
//             }
//             let [...unique] = new Set(machinesInEachWhl);
//             machinesInAllWhl.push(unique);
//       }
//       return machinesInAllWhl
// }

// function includeIngotCountAndUniqueMachines(data, ingotCount, uniqueMachines){
//       let newObj = data.map( (obj, index)=> {
//             return {...obj._doc, count:ingotCount[index], uniqueMachines: uniqueMachines[index]}
//       })
//       return newObj
// }

function includeIngotCountAndUniqueMachines(data, ingotCount){
      let newObj = data.map( (obj, index)=> {
            return {...obj._doc, count:ingotCount[index]}
      })
      return newObj
}