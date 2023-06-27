const { User } = require("../db");
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const { generateRegistrationToken, getTokenData, generateLoginToken } = require("../config/jwt.config");
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
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res
          .status(400)
          .send({ message: "You must enter a valid email and a password" });
      }
      const userDb = await User.findOne({
        where: {
          email
        }
      })
      if ( !userDb ){
        return res.status(400).send({message: `No user registered with ${email}` })
      }
      if (userDb.verified === false) {
        return res.status(400).send({
          message: "You must confirm your account before loging in. Check your inbox",
        });
      }
      const passwordMatch = await bcrypt.compare(password, userDb.password);
      if (passwordMatch) {
        let today = new Date();
        let now = today.toLocaleDateString('en-US')
        userDb.last_login = now; 
        await userDb.save();

        const userFormated = {
          id: userDb.id,
          email: userDb.email,
          id_type: userDb.id_type,
          verified: userDb.verified,
          username: userDb.username,
          name: userDb.name,
          last_login: userDb.last_login,
          last_logout: userDb.last_logout
        };
        const token = generateLoginToken(userFormated);
        const payload = {
          ...userFormated,
          token,
        };
        return res.status(200).json(payload);
      } else {
        return res.status(400).send({ message: "Wronng password" });
      }

    } catch (error) {
      res.send({message: error.message})
    }
  }
}