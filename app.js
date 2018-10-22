require('dotenv').config();

const   express         = require("express"),
        app             = express(),
        db              = require("./models"),
        http            = require('http'),
        bodyParser      = require("body-parser"),
        methodOverride  = require("method-override"),
        passport        = require("passport"),
        LocalStrategy   = require("passport-local"),
        flash           = require("connect-flash"),
        expressSanitizer= require("express-sanitizer"),
        cp              = require("child_process");

const   server          = http.createServer(app);

const authRoutes = require("./routes/auth");

const   ingotRoutes = require("./routes/ingot/ingots"),
        infoRoutes  = require("./routes/ingot/infos"),
        operatorRoutes = require("./routes/ingot/operators"),
        rejectRoutes = require("./routes/ingot/rejects"),
        wheelRoutes = require("./routes/ingot/wheels");

const serialBatchRoutes = require("./routes/wheel/wheels");

const dashboardRoutes = require("./routes/dashboard");
       
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/vendor"));
app.use(express.static(__dirname + "/node_modules/chart.js/dist"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret:"alexwck",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(db.User.authenticate()));
passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());

app.use(function(req,res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

let child = cp.fork("child.js");
child.on("exit", ()=>{
    console.log("Child terminated!")
})

app.get("/",function(req, res){
    res.render("main/landing");
});

app.use("/auth", authRoutes);
app.use("/ingots", ingotRoutes);
app.use("/ingots/:ingot_id/grinding/operator", operatorRoutes);
app.use("/ingots/:ingot_id/grinding/info", infoRoutes);
app.use("/ingots/:ingot_id/grinding/reject", rejectRoutes);
app.use("/ingots/:ingot_id/grinding/wheel", wheelRoutes);

app.use("/wheels",serialBatchRoutes);

app.use("/dashboard",dashboardRoutes);

app.use(function(req,res){
    res.status(404).sendFile(__dirname + "/public/404/index.html");
})

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

server.listen(3000, 'localhost');
server.on('listening', function() {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});