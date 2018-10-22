const   db      = require("../../models"),
        moment  = require("moment");

// UPDATE FORM ROUTE
exports.updateInfoForm = async (req, res) =>{
    try{
        // Is user logged in?
        if(req.isAuthenticated()){
            // Is the user an admin?
            if(req.user.isAdmin){
                let ingot = await db.Ingot.findById(req.params.ingot_id).select("order lot grinding.grDate grinding.machine");
                res.render("ingot/infos/edit", { ingot, moment });
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
        req.flash("error","Something went wrong when trying to access the info form");
        res.redirect(`/ingots/${req.params.ingot_id}`);
        console.log({
            message: "Cannot find info ID, therefore form could not appear",
      });
    }
};

// UPDATE ROUTE
exports.updateInfo = (req, res) =>{
    req.body.machine = req.sanitize(req.body.machine);
    req.body.grDate = req.sanitize(req.body.grDate);

    let update ={
        "grinding.machine": req.body.machine,
        "grinding.grDate": req.body.grDate
    };
    db.Ingot.findByIdAndUpdate(req.params.ingot_id, update, {runValidators: true})
    .then(()=>{
        req.flash("success","Successfully updated info!");
        res.redirect(`/ingots/${req.params.ingot_id}`);
    })
    .catch(err =>{
        req.flash("error","Something went wrong when trying to update the info");
        res.redirect(`/ingots/${req.params.ingot_id}`);
        console.log(err);
    });
};
