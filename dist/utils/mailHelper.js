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
require('dotenv').config();
const nodemailer = require('nodemailer');
const ejs = require('ejs');
console.log(process.env.FROM_EMAIL, process.env.EMAIL_PASS);
var transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_PASS
    }
});
function sendMail(to, subject, text, html) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("sendMail Function Initialized");
        var mailOptions = {
            from: process.env.FROM_EMAIL,
            to: to,
            subject: subject,
            text: text,
            html: html
        };
        let x;
        try {
            x = yield transporter.sendMail(mailOptions);
        }
        catch (err) {
            x = err;
            console.log(err);
        }
        return x;
    });
}
const renderFile = (file, data) => {
    return new Promise((resolve) => {
        ejs.renderFile(file, data, (err, result) => {
            if (err) {
                console.log(err);
                return err;
            }
            resolve(result);
        });
    });
};
module.exports = { sendMail, renderFile };
