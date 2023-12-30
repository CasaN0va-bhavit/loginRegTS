import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import passport from "passport";
import flash from "express-flash";
import session from "cookie-session";
import passportInit from "../utils/passportConfig";
const {ensureAuthenticated, forwardAuthenticated} = require('../utils/authenticate')

const indexRouter = require('../routers/indexRouter'),
      loginRouter = require('../routers/loginRouter'),
      regRouter = require('../routers/regRouter');

mongoose.connect(process.env.MONGO_URI!).then((): void => {
  console.log("MONGO CONNECTED SUCCESSFULLY")
}).catch((e) => {
  console.log(e)
})


const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.static('public'))
app.use('/', express.static('public'))
app.use(express.static('uploads'))
app.use('/', express.static('uploads'))
app.set('view engine', 'ejs')
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
}))
app.use(express.urlencoded({extended: false}))
app.use(express.json({limit: '1mb'}))

app.use(passport.initialize())
app.use(passport.session())
passportInit(passport)

// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });

app.use('/', indexRouter)
app.use('/login', forwardAuthenticated, loginRouter)
app.use('/register', forwardAuthenticated, regRouter)

app.get('/logout', (req: Request, res: Response) => {
  req.logout(() => {
    console.log("logged out")
  });
  res.redirect('/login')
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});