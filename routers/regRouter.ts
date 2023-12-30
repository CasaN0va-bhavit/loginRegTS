require('dotenv').config()
const User = require('../schemas/userSchema')
const bcrypt = require('bcrypt')
const ejs = require('ejs')
import express, {Express, Request, Response} from "express"
const router = express.Router()

router.get('/', (req: Request, res: Response) => {
    res.render('register', {error: "", user: false})
})

router.post('/', async (req: Request, res: Response) => {
    const {email, fname, lname, password, cpassword} = req.body
    const foundUser = await User.findOne({email})
    if (!email || !password || !fname || !lname || !cpassword) {
        return res.render('register', {error: 'Please enter all the credentials', user: false})
    }
    if (password !== cpassword) {
        return res.render('register', {error: 'The passwords do not match!', user: false})
    }
    if (foundUser) return res.render('register', {error: "A user already exists with this email.", user: false})
    const hashedPassword = await bcrypt.hash(password, 256)
    const newUser = new User({
        email: email,
        fname: fname,
        lname: lname,
        password: hashedPassword
    })
    await newUser.save()
    return res.redirect('/login')
});


router.get('/logout', (req: Request, res: Response) => {
    req.logout(() => {
        console.log("Logged out")
    });
    res.redirect('/login');
});

module.exports = router