import passportLocal from "passport-local";
const LocalStrategy = (passportLocal.Strategy)
const bcrypt = require('bcrypt')
const User = require('../schemas/userSchema')

export default function passportInit(passport: any) {
    passport.use(
        new LocalStrategy({usernameField: 'email'},
            async (email, password, done) => {
                const user = await User.findOne({email});
                console.log(user)
                if (!user) {
                    return done(null, false, { message: 'That email is not registered' });
                }
                bcrypt.compare(password, user.password, (err: any, isMatch: any) => {
                    if (err) throw err
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            })
    );

    passport.serializeUser(function (user: any, done: Function) {
        done(null, user.id);
    });

    passport.deserializeUser(async function (id: string, done: Function) {
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (err) {
            console.log(err)
        }
    });
}