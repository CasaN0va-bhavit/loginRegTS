require('dotenv').config()
const nodemailer = require('nodemailer');
const ejs = require('ejs')

console.log(process.env.FROM_EMAIL, process.env.EMAIL_PASS)


var transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

async function sendMail(to: String, subject: String, text: String, html?: any) {
  console.log("sendMail Function Initialized")
  var mailOptions = {
    from: process.env.FROM_EMAIL,
    to: to,
    subject: subject,
    text: text,
    html: html
  };
  let x;
  try {
    x = await transporter.sendMail(mailOptions);
  } catch (err) {
    x = err;
    console.log(err)
  }
  return x;
}

const renderFile = (file: any, data: any) => {
  return new Promise((resolve) => {
    ejs.renderFile(file, data, (err: any, result: any) => {
      if (err) {
        console.log(err);
        return err;
      }
      resolve(result);
    });
  });
};


module.exports = { sendMail, renderFile };