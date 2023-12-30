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
// const router = require('express').Router()
const passport = require('passport');
const mailHelper = require('../utils/mailHelper');
const User = require('../schemas/userSchema');
const bcrypt = require('bcrypt');
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    console.log(req.user == undefined);
    res.render('login', { user: false, message: "" });
});
router.post('/', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
    successRedirect: '/'
}));
router.post('/forgot', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.email);
    const reqUser = yield User.findOne({ email: req.body.email });
    console.log(reqUser);
    if (!reqUser) {
        return res.send("Please enter an email Id that is registered");
    }
    var link = process.env.DOMAIN + 'login/forgot/' + reqUser.id;
    console.log(link);
    yield mailHelper.sendMail(req.body.email, "Password change", "Go to this link to change your password: " + link);
    return res.send("An email has been sent to your account, please check your inbox and click on the link there.");
}));
router.get('/forgot/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('fPass', { error: "", user: yield User.findById(req.params.id) });
}));
router.post('/forgot/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!req.body.newPassword) {
        return res.render('fPass', { error: "Please enter a password", user: yield User.findById(id) });
    }
    console.log(req.body.newPassword);
    const newPassword = yield bcrypt.hash(req.body.newPassword, 10);
    console.log(newPassword);
    yield User.findByIdAndUpdate(id, {
        $set: {
            password: newPassword
        }
    });
    res.redirect('/login');
}));
module.exports = router;
