const { User } = require("../db");
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const { generateRegistrationToken, getTokenData } = require("../config/jwt.config");
const { getTemplate, sendEmail } = require("../config/mail.config");
const dotenv = require("dotenv");
dotenv.config();
const sender = process.env.EMAIL;
const CLIENT_HOST = process.env.CLIENT_HOST;
const EMAIL = process.env.EMAIL;
const ROUNDS = Number(process.env.ROUNDS)

module.exports = {
  registerUser: async (req, res) => {
    try {
      const { name, id_type, userName, email, password } = req.body;

      if (!name || !id_type || !userName || !email || !password) {
        return res.json({
          success: false,
          msg: "You must fill all the required fields",
        });
      }

      let user = await User.findOne({
        where: {
          username: userName,
        },
      });
      let userEmail = await User.findOne({
        where: {
          email,
        },
      });

      if (user || userEmail) {
        if(user){
          return res.json({
            success: false,
            msg: "This user name is not avaliable",
          });
        }
        if(userEmail){
          return res.json({
            success: false,
            msg: "This email is already registered",
          });
        }
      } else {
        const code = v4();
        let passwordHashed = await bcrypt.hash(password, ROUNDS);
        user = await User.create({
          name,
          id_type,
          username: userName,
          email,
          password: passwordHashed,
          code,
        })
        const token = generateRegistrationToken({ email, code });
        const template = getTemplate(name, token);

        await sendEmail(email, "Confirm your account", template);

        return res.json({
          success: true,
          msg: "User successfully registered",
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        msg: error.message,
      });
    }
  },
  confirm: async (req, res) => {
    try {
      const { token } = req.params;
      const data = getTokenData(token);
      if (data === null) {
        return res.json({
          success: false,
          msg: "Error. Data couldn't be acccessed ",
        });
      }

      const { email, code } = data;
      let user = await User.findOne({
        where: {
          email,
        },
      });
      if (user === null) {
        return res.json({
          success: false,
          msg: "The user doesn't exist",
        });
      }
      if (code !== user.code) {
        return res.redirect("/error.html");
      }
      user.verified = true;
      await user.save();
      return res.redirect(`${CLIENT_HOST}home`);
    } catch (error) {
      return res.json({
        success: false,
        msg: error.message
      });
    }
  },
  getUsers: async (req, res) => {
    const { id } = req.query;

    if (id) {
      try {
        const user = await User.findOne({
          where: {
            id,
          },
        });
        if (!user) res.status(404).send({ message: `No user asigned the ID ${id}` });
        res.status(200).send(user);
      } catch (error) {
        res.status(400).send("oops I did it again");
      }
    } else {
      try {
        const users = await User.findAll();
        res.json(users);
      } catch (error) {
        res.json(error);
      }
    }
  },
}