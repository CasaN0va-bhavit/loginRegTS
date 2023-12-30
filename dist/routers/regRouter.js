"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const User = require('../schemas/userSchema');
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.render('register', { error: "", user: false });
});
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fname, lname, password, cpassword } = req.body;
    const foundUser = yield User.findOne({ email });
    if (!email || !password || !fname || !lname || !cpassword) {
        return res.render('register', { error: 'Please enter all the credentials', user: false });
    }
    if (password !== cpassword) {
        return res.render('register', { error: 'The passwords do not match!', user: false });
    }
    if (foundUser)
        return res.render('register', { error: "A user already exists with this email.", user: false });
    const hashedPassword = yield bcrypt.hash(password, 256);
    const newUser = new User({
        email: email,
        fname: fname,
        lname: lname,
        password: hashedPassword
    });
    yield newUser.save();
    return res.redirect('/login');
}));
router.get('/logout', (req, res) => {
    req.logout(() => {
        console.log("Logged out");
    });
    res.redirect('/login');
});
module.exports = router;
