const   db      = require("../../models");

// UPDATE FORM ROUTE
exports.updateRejectForm = async (req, res) =>{
    try{
        // Is user logged in?
        if(req.isAuthenticated()){
             // Is the user an admin?
             if(req.user.isAdmin){
                 let ingot = await db.Ingot.findById(req.params.ingot_id).select("order lot grinding.grpcs grinding.grcf grinding.grbrk grinding.grcrk grinding.grout grinding.grdam grinding.groth");
                 res.render("ingot/rejects/edit", { ingot});
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
        req.flash("error","Something went wrong when trying to access the reject form");
        res.redirect(`/ingots/${req.params.ingot_id}`);
        console.log({
            message: "Cannot find reject ID, therefore form could not appear",
      });
    }
};

// UPDATE ROUTE
exports.updateReject = (req, res) =>{
    req.body.grcf = req.sanitize(req.body.grcf);
    req.body.grbrk = req.sanitize(req.body.grbrk);
    req.body.grcrk = req.sanitize(req.body.grcrk);
    req.body.grout = req.sanitize(req.body.grout);
    req.body.grdam = req.sanitize(req.body.grdam);
    req.body.groth = req.sanitize(req.body.groth);
    req.body.grpcs = req.sanitize(req.body.grpcs);

    let update ={
        "grinding.grcf": req.body.grcf,
        "grinding.grbrk": req.body.grbrk,
        "grinding.grcrk": req.body.grcrk,
        "grinding.grout": req.body.grout,
        "grinding.grdam": req.body.grdam,
        "grinding.groth": req.body.groth,
        "grinding.grpcs": req.body.grpcs
    };
    db.Ingot.findByIdAndUpdate(req.params.ingot_id, update, { runValidators: true })
    .then(()=>{
        req.flash("success","Successfully updated rejects!");
        res.redirect(`/ingots/${req.params.ingot_id}`);
    })
    .catch(err=>{
        req.flash("error","Something went wrong when trying to update the rejects");
        res.redirect(`/ingots/${req.params.ingot_id}`);
        console.log(err);
    });
};