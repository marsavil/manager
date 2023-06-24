const { Affiliate_link, User } = require('../db');
const { getAffiliateCode } = require('../config/code.confg');
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
      let today = new Date();
      let now = today.toLocaleDateString('en-US')
      await Affiliate_link.create({
        id_users: user.id,
        affiliate_code: getAffiliateCode(10),
        creation_date: now
      });
      res.status(200).send({message: "Link created succesfully"})
    } catch (error) {
      res.status(500).send({ message: error.message})
    }
    
  },
  getLinks : async (req, res) => {
    try {
      const { id } = req.params;
      if ( id ){
        const link = await Affiliate_link.findOne({
          wher: {
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
  }
}

