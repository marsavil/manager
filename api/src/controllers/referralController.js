const { Referral, Affiliate_link } = require('../db');

module.exports = {
  addReferral: async (req, res) => {
    try {
      const { name, email, phone, affiliate_code, comment } = req.body
      let today = new Date();
      let now = today.toLocaleDateString('en-US')
      const link = await Affiliate_link.findOne({
        where: {
          affiliate_code
        }
      })
      const referral = await Referral.findOne({
        where: {
          email
        }
      })
      if ( !referral ){
        Referral.create({
          name,
          email,
          phone,
          affiliate_code,
          creation_date: now,
          comment,
          manager_id: link.id_users
        })
        res.status(201).send({message: "Referral successfully stored in DB"})
      } else {
        res.status(401).send({message: `${email} is already registered in our Data Base`})
      }
    } catch (error) {
      res.send({message: error.message})
    }
  },
  getReferrals: async (req, res) => {
    console.log('entro en el controlador')
    try {
      const { id } = req.params;
      if ( id ){
        const referral = await Referral.findOne({
          where: {
            id
          }
        })
        res.status(201).send(referral)
      } else {
        const referrals = await Referral.findAll()
        res.status(201).send(referrals)
      }
    } catch (error) {
      res.send({ message: error.message })
    }
  }
}