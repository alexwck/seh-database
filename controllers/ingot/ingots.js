const   db      = require("../../models"),
        moment  = require("moment");

// INDEX ROUTE
exports.getIngots = (req, res) => {
      let perPage = 20;
      let pageQuery = parseInt(req.query.page, 10);
      let pageNumber = pageQuery ? pageQuery : 1;
      
      let noMatch = null;

      let filter = {
            "order":1,
            "lot":1,
            "grinding.groove":1,
            "grinding.whlLife":1,
            "grinding.grDate":1,
            "grinding.machine":1,
            "grinding.drawingNo":1
      }
      // If there is a search query
      if(req.query.search){
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            db.Ingot.find({"lot": regex}, filter)
            .skip((perPage*pageNumber)-perPage)
            .limit(perPage)
            .sort({"grinding.grDate":-1, "grinding.machine":1,"grinding.drawingNo":1})
            .exec(function(err, data){
                  db.Ingot.countDocuments().exec(function(err, count){
                        if(err){
                              req.flash("error","Something wrong when getting the list of ingots");
                              res.redirect("/ingots");
                              console.log(err);
                        }
                        else{
                              if(data.length < 1){
                                    noMatch = "No ingot lot match that query, please try again.";
                              }
                              res.render("ingot/ingots/index", { 
                                    data: data, 
                                    tab: "ingots",
                                    current: pageNumber,
                                    count: count,
                                    pages: Math.ceil(count/ perPage),
                                    search: req.query.search,
                                    noMatch: noMatch,
                                    moment: moment
                              });
                        }
                  })
            })      
      } else{
            // If no do search query
            db.Ingot.find({}, filter)
            .skip((perPage*pageNumber)-perPage)
            .limit(perPage)
            .sort({"grinding.grDate":-1, "grinding.machine":1,"grinding.drawingNo":1})
            .exec(function(err, data){
                  db.Ingot.countDocuments().exec(function(err, count){
                        if(err){
                              req.flash("error","Something wrong when getting the list of ingots");
                              res.redirect("/ingots");
                              console.log(err);
                        }
                        else{
                              res.render("ingot/ingots/index", { 
                                    data: data, 
                                    tab: "ingots",
                                    current: pageNumber,
                                    count: count,
                                    pages: Math.ceil(count/ perPage),
                                    search: false,
                                    noMatch: noMatch,
                                    moment: moment
                              });
                        }
                  })
            })      
      }
};

// SHOW ROUTE
exports.showIngot = async (req, res) => {
      try{
            let ingot = await db.Ingot.findById(req.params.ingot_id);
            let wheel = await db.Wheel.find({ "ingots": ingot._id})

            await res.render("ingot/ingots/show", {ingot, wheel, moment});
      }
      catch(err){
            req.flash("error","Something went wrong when trying to display the ingot");
            res.redirect("/ingots");
            console.log(err);
      }
};

function escapeRegex(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};