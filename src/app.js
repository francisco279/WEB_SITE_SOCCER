import express           from "express";
import { engine }        from "express-handlebars";
import path              from "path";
import morgan            from "morgan";
import teamRoutes        from "./routes/teamsRoutes.js";
import playerRoutes      from "./routes/playersRoutes.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import userRoutes        from "./routes/users.js"
import conecta           from "./database.js";
import MethodOverride    from "method-override";
import session           from "express-session";
import passport          from "passport";
import "./config/passport.js";
import multer            from "multer";
import Handlebars        from  'handlebars';
import {allowInsecurePrototypeAccess} from '@handlebars/allow-prototype-access';
import cookieParser      from "cookie-parser";

//express server 
const app = express();
conecta(); //conect to mongoDB

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set("views", path.join(__dirname, "views")); //set the views folder
//handlebars configuration
app.engine(
    ".hbs",
    engine({
      layoutsDir:    path.join(app.get("views"), "layouts"), //common views
      partialsDir:   path.join(app.get("views"), "partials"), //common views
      defaultLayout: "main",
      extname:       ".hbs",
      handlebars    : allowInsecurePrototypeAccess(Handlebars),
    })
);

app.set("view engine", ".hbs");

//middlewares
app.use(morgan("dev")); // to show console messages 
app.use(multer({dest: path.join(__dirname, './public/upload/temp')}).single('image'));
app.use(express.urlencoded({extended: false})) //to receive forms data
app.use(express.json()); 
app.use(MethodOverride("_method"));
app.use(session(
  {
    secret            : "mysecretapp",
    resave            : true,
    saveUninitialized : true
  }
));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
}); 
//routes
app.use(userRoutes);
app.use(teamRoutes);
app.use(playerRoutes);


//statics files (public files)
// The Public directory for static files
app.use("/public", express.static(path.join(__dirname, "./public")));
export default app;