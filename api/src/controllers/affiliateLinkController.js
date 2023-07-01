const { Affiliate_link, User } = require('../db');
const { getCode } = require('../config/code.confg');
const { getTokenData } = require('../config/jwt.config')

module.exports = {
  generateLink : async( req, res ) => {
    try {
      const { token } = req.body;
      const data = getTokenData(token);
      const { email } = data
      const user = await User.findOne({
        where: {
          email
        }
      });
      let link = await Affiliate_link.findOne({
        where: {
          id_users: user.id
        }
      })
      if ( !link ){
        let today = new Date();
        let now = today.toLocaleDateString('en-US')
        await Affiliate_link.create({
          id_users: user.id,
          affiliate_code: getCode(10),
          creation_date: now
        });
        res.status(200).send({message: "Link created succesfully"})
      } else {
        res.status(401).send({message: "This user already has an affiliate link asigned"})
      }

    } catch (error) {
      res.status(500).send({ message: error.message})
    }
    
  },
  getLinks : async (req, res) => {
    try {
      const { id } = req.params;
      if ( id ){
        const link = await Affiliate_link.findOne({
          where: {
            id
          }
        })
        res.status(200).send(link)
      } else {
        const links = await Affiliate_link.findAll()
        res.status(200).send(links)
      }
    } catch (error) {
      res.status(500).send({ message: error.message})
    }
  },
  getAffiliateLink: async (req, res) => {
    try {
      const { id } = req.params
      let link = await Affiliate_link.findOne({
        where: {
          id_users: id
        }
      })
      if ( link ){
        res.status(201).send(link)
      } else {
        res.status(500).send({message: `The user identified witn the id ${id} has no affiliate link asigned yet`})
      } 
    } catch (error) {
      res.send(error.message)
    }
  }
}

