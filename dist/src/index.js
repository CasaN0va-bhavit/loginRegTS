"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const express_flash_1 = __importDefault(require("express-flash"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passportConfig_1 = __importDefault(require("../utils/passportConfig"));
const { ensureAuthenticated, forwardAuthenticated } = require('../utils/authenticate');
const indexRouter = require('../routers/indexRouter'), loginRouter = require('../routers/loginRouter'), regRouter = require('../routers/regRouter');
mongoose_1.default.connect(process.env.MONGO_URI).then(() => {
    console.log("MONGO CONNECTED SUCCESSFULLY");
}).catch((e) => {
    console.log(e);
});
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.static('public'));
app.use('/', express_1.default.static('public'));
app.use(express_1.default.static('uploads'));
app.use('/', express_1.default.static('uploads'));
app.set('view engine', 'ejs');
app.use((0, express_flash_1.default)());
app.use((0, cookie_session_1.default)({
    secret: process.env.SESSION_SECRET,
}));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json({ limit: '1mb' }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, passportConfig_1.default)(passport_1.default);
// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });
app.use('/', indexRouter);
app.use('/login', forwardAuthenticated, loginRouter);
app.use('/register', forwardAuthenticated, regRouter);
app.get('/logout', (req, res) => {
    req.logout(() => {
        console.log("logged out");
    });
    res.redirect('/login');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
