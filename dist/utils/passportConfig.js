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
const passport_local_1 = __importDefault(require("passport-local"));
const LocalStrategy = (passport_local_1.default.Strategy);
const bcrypt = require('bcrypt');
const User = require('../schemas/userSchema');
function passportInit(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => __awaiter(this, void 0, void 0, function* () {
        const user = yield User.findOne({ email });
        console.log(user);
        if (!user) {
            return done(null, false, { message: 'That email is not registered' });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err)
                throw err;
            if (isMatch) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: 'Password incorrect' });
            }
        });
    })));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User.findById(id);
                done(null, user);
            }
            catch (err) {
                console.log(err);
            }
        });
    });
}
exports.default = passportInit;
