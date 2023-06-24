const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();
const EMAIL = process.env.EMAIL;
const EMAIL_PSSWRD = process.env.EMAIL_PSSWRD;
const SERVER = process.env.SERVER
const CLIENT_HOST = process.env.CLIENT_HOST


const mail = {
  user: EMAIL,
  pass: EMAIL_PSSWRD,
};

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  tls: {
    rejectUnauthorized: false,
  },
  secure: true, // true for 465, false for other ports
  auth: {
    user: mail.user, // generated ethereal user
    pass: mail.pass, // generated ethereal password
  },
});

module.exports = {
  sendEmail: async (email, subject, html) => {
    try {
      await transporter.sendMail({
        from: `${mail.user}`,
        to: email,
        subject,
        text: "Welcome to ****",
        html,
      });
    } catch (error) {
      console.log("Something went wrong with your email", error);
    }
  },
  sendStatusEmail: async (email, subject, html) => {
    try {
      await transporter.sendMail({
        from: `${mail.user}`,
        to: email,
        subject,
        text: "IMPORTANT INFORMATION FOR YOU",
        html,
      });
    } catch (error) {
      console.log("Something went wrong with your email", error);
    }
  },

  getTemplate: (email, token) => {
    return `
      <head>
          <link rel="stylesheet" href="./style.css">
      </head>
      
      <div id="email___content">
          <img src="https://www.flickr.com/photos/197399024@N05/52623616952/in/dateposted-public/" alt="">
          <h2>Hola ${email}</h2>
          <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
          <a
              href="${SERVER}user/confirm/${token}"
              target="_blank"
          >Confirmar Cuenta</a>
      </div>
    `;
  }
}