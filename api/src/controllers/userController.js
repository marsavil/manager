const { User, Affiliate_link, Referral } = require("../db");
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const { generateRegistrationToken, getTokenData, generateLoginToken } = require("../config/jwt.config");
const { getTemplate, sendEmail, getRegistrationTemplate } = require("../config/mail.config");
const { getCode } = require("../config/code.confg")
const dotenv = require("dotenv");
const { DatabaseError } = require("sequelize");
dotenv.config();
const sender = process.env.EMAIL;
const CLIENT_HOST = process.env.CLIENT_HOST;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD
const ROUNDS = Number(process.env.ROUNDS)

module.exports = {
  chargeAdmin: async () => {
    try {
      let passwordHashed = await bcrypt.hash(PASSWORD, ROUNDS);
      const admin = await User.findOne({
        where:{
          name: 'Admin'
        }
      })
      if (!admin){
        User.create({
          name: "Admin",
          id_type: 1,
          username: "Admin",
          email: EMAIL,
          password: passwordHashed,
          verified: true
        })
      }
      console.log("Admin user charged")
    } catch (error) {
      console.log(error.message)
    }

  },
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
  referralToAffiliate: async (req, res) => {
    try {
      const { id } = req.params;
      const { token } = req.body;
      const data = getTokenData(token);
      const userLogged = {
        id: data.id,
        email: data.email,
        id_type: data.id_type,
        verified: data.verified,
        username: data.username,
        name: data.name,
        last_login: data.last_login,
        last_logout: data.last_logout,
        affiliate_code: data.affiliate_code,
      }
      if (data === null){
        return res.json({
          success: false,
          msg: "Error. Data couldn't be acccessed ",
        });
      }
      if (data.message === 'Token expired'){
        return res.json({
          success: false,
          msg: "Your session has expired. Please Login ",
        });
      }
      if(userLogged.id_type === 3){
        return res.json({
          success: false,
          msg: "This is user is not allowed to perform this action"
        })
      }
      const referral = await Referral.findOne({
        where: {
          id
        }
      });
      let user = await User.findOne({
        where: {
          email: referral.email
        }
      })
      if ( !user ){
        const code = v4();
        let defaultPass = getCode(8)
        let passwordHashed = await bcrypt.hash(defaultPass, ROUNDS);
        const newUser = await User.create({
          name: referral.name,
          id_type: 3,
          username: referral.email,
          email: referral.email,
          password: passwordHashed,
          code
        })
        const token = generateLoginToken(userLogged)
        const email = newUser.email
        const tokenRegistration = generateRegistrationToken({ email, code });
        const template = getRegistrationTemplate(newUser.name, defaultPass, tokenRegistration);
        await sendEmail(email, "Validate your account", template);
        return res.json({
          success: true,
          msg: "User successfully registered",
          token
        });
      } else {
        const token = generateLoginToken(userLogged)
        if(user.verified === false){
          const code = user.code
          let defaultPass = getCode(8)
          let passwordHashed = await bcrypt.hash(defaultPass, ROUNDS);
          user.password = passwordHashed
          const token = generateLoginToken(userLogged)
          const email = user.email
          const tokenRegistration = generateRegistrationToken({ email, code });
          const template = getRegistrationTemplate(user.name, defaultPass, tokenRegistration);
          await sendEmail(email, "Validate your account", template);
          return res.json({
            success: true,
            msg: "This user is already registered. An email was re sent to verify the account",
            token
          })
        }
        res.status(401).send({message: "This user is already registered", token})
      }

    } catch (error) {
      res.send(error.message)
    }
  },
  deleteUser: async (req, res) => {
    const { token } = req.body;
      const data = getTokenData(token);
      console.log(data)
      if (data === null){
        return res.json({
          success: false,
          msg: "Error. Data couldn't be acccessed ",
        });
      }
      if (data.message === 'Token expired'){
        return res.json({
          success: false,
          msg: "Your session has expired. Please Login ",
        });
      }
      if(data.id_type === 3){
        return res.json({
          success: false,
          msg: "This is user is not allowed to perform this action"
        })
      }
    try {
      const { id } = req.params;
      let user = await User.findOne({
        where: {
          id
        }
      })
      if(!user){
        return res.status(401).send({message: `There i no user asigned to id ${id}`})
      }
      if (user.id_type === 1){
        return res.status(401).send({message: "This user can't be deleted"})
      }else{
        user.enabled = false
        user.save()
        res.status(201).send({message: "User logically deleted from DB"})
      }
    } catch (error) {
      res.send(error.message)
    }
  },
  restoreUser: async (req, res) => {
    const { token } = req.body;
      const data = getTokenData(token);
      console.log(data)
      if (data === null){
        return res.json({
          success: false,
          msg: "Error. Data couldn't be acccessed ",
        });
      }
      if (data.message === 'Token expired'){
        return res.json({
          success: false,
          msg: "Your session has expired. Please Login ",
        });
      }
      if(data.id_type === 3){
        return res.json({
          success: false,
          msg: "This is user is not allowed to perform this action"
        })
      }
    try {
      const { id } = req.params;
      let user = await User.findOne({
        where: {
          id
        }
      })
      if(!user){
        return res.status(401).send({message: `There i no user asigned to id ${id}`})
      }else{
        user.enabled = true
        user.save()
        res.status(201).send({message: "User logically enabled in DB"})
      }
    } catch (error) {
      res.send(error.message)
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
      console.log(error.message)
      return res.json({
        success: false,
        msg: error.message
      });
    }
  },
  getUsers: async (req, res) => {
    const { id } = req.params;
    const { token } = req.body;
    const data = getTokenData(token);
    if (data === null){
      return res.json({
        success: false,
        msg: "Error. Data couldn't be acccessed ",
      });
    }
    if (data.message === 'Token expired'){
      return res.json({
        success: false,
        msg: "Your session has expired. Please Login ",
      });
    }
    if(data.id_type === 3){
      return res.json({
        success: false,
        msg: "This is user is not allowed to perform this action"
      })
    }
    if (id) {
      try {
        const user = await User.findOne({
          where: {
            id,
          },
        });
        if (!user) return res.status(404).send({ message: `No user assigned the ID ${id}` });
        return res.status(200).send(user);
      } catch (error) {
        return res.status(400).send("Oops, I did it again");
      }
    } else {
      try {
        const users = await User.findAll();
        return res.json(users);
      } catch (error) {
        return res.json(error);
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
      if(!userDb.enabled){
        return res.status(400).send({message: 'This user is banned'})
      }
      const passwordMatch = await bcrypt.compare(password, userDb.password);
      if (passwordMatch && userDb.enabled === true) {
        let today = new Date();
        let now = today.toLocaleDateString('en-US')
        userDb.last_login = now;
        await userDb.save(); 
        let link;
        if (userDb.id_type === 3){
          link = await Affiliate_link.findOne({
            where: {
              id_users: userDb.id
            }
          })     
          if ( !link ){
            link = Affiliate_link.create({
              id_users: userDb.id,
              affiliate_code: getCode(10),
              creation_date: now
            })
          }
        }
        
        const userFormated = {
          id: userDb.id,
          email: userDb.email,
          id_type: userDb.id_type,
          verified: userDb.verified,
          username: userDb.username,
          name: userDb.name,
          last_login: userDb.last_login,
          last_logout: userDb.last_logout,
          affiliate_code: link ? link.affiliate_code : null
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