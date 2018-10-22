const   db      = require("../../models");

// UPDATE FORM ROUTE
exports.updateOperatorForm = async (req, res) =>{
    try{
        // Is user logged in?
        if(req.isAuthenticated()){
            // Is the user an admin?
            if(req.user.isAdmin){
                let ingot = await db.Ingot.findById(req.params.ingot_id).select("order lot grinding.opt1 grinding.opt2");
                res.render("ingot/operators/edit", {ingot});
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
        req.flash("error","Something went wrong when trying to access the operator form");
        res.redirect(`/ingots/${req.params.ingot_id}`);
        console.log({
            message: "Cannot find operator ID, therefore form could not appear",
      });
    }
};

// UPDATE ROUTE
exports.updateOperator = (req, res) =>{
    req.body.opt1 = req.sanitize(req.body.opt1);
    req.body.opt2 = req.sanitize(req.body.opt2);

    let update ={
        "grinding.opt1": req.body.opt1,
        "grinding.opt2": req.body.opt2
    };
    db.Ingot.findByIdAndUpdate(req.params.ingot_id, update, { runValidators: true })
    .then(()=>{
        req.flash("success","Successfully updated operator!");
        res.redirect(`/ingots/${req.params.ingot_id}`);
    })
    .catch(err=>{
        req.flash("error","Something went wrong when trying to update the operator");
        res.redirect(`/ingots/${req.params.ingot_id}`);
        console.log(err);
    });
};