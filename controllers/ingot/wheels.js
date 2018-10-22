const   db      = require("../../models");

// UPDATE FORM ROUTE
exports.updateWheelForm = async (req, res) =>{
    try{
        // Is user logged in?
        if(req.isAuthenticated()){
            // Is the user an admin?
            if(req.user.isAdmin){
                let ingot = await db.Ingot.findById(req.params.ingot_id).select("order lot grinding.maker grinding.drawingNo grinding.groove grinding.whlLife");
                res.render("ingot/wheels/edit", { ingot});
            }
            else{
                req.flash("error","You do not have administrator privilege to do that!");
                res.redirect("/auth/login");
            }
        } else{
            req.flash("error","You need to log in to do that!");
            res.redirect("/auth/login");
        }
    } catch(err){
        req.flash("error","Something went wrong when trying to access the wheel form");
        res.redirect(`/ingots/${req.params.ingot_id}`);
        console.log({
            message: "Cannot find wheel ID, therefore form could not appear",
      });
    }
};

// UPDATE ROUTE
exports.updateWheel = (req, res) =>{
    req.body.maker = req.sanitize(req.body.maker);
    req.body.drawingNo = req.sanitize(req.body.drawingNo);
    req.body.groove = req.sanitize(req.body.groove);
    req.body.whlLife = req.sanitize(req.body.whlLife);

    let update ={
        "grinding.maker": req.body.maker,
        "grinding.drawingNo": req.body.drawingNo,
        "grinding.groove": req.body.groove,
        "grinding.whlLife": req.body.whlLife
    };
    db.Ingot.findByIdAndUpdate(req.params.ingot_id, update)
    .then(()=>{
        req.flash("success","Successfully updated wheel!");
        res.redirect(`/ingots/${req.params.ingot_id}`);
    })
    .catch(err=>{
        req.flash("error","Something went wrong when trying to update the wheel");
        res.redirect(`/ingots/${req.params.ingot_id}`);
        console.log(err);
    });
};