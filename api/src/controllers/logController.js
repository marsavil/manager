const { Sales_log, Channel } = require('../db');

module.exports = {
  addLog: async(req, res) => {
    try {
      const { idReferral, channel, comment } = req.body;
      const logs = await Sales_log.findAll({
        where: {
          id_referral: idReferral
        }
      })
      const channelDb = await Channel.findOne({
        where : {
          type: channel
        }
      })
      await Sales_log.create({
        id_referral: idReferral,
        id_channel: channelDb.id,
        chat_rate: logs.length + 1,
        comments: comment
      })
      res.status(201).send({message: "Log registered successfully"})
    } catch (error) {
      res.status(400).send(error.message)
    }
  },
  getLogs: async (req, res) => {
    const { id } = req.params;
    try {
      if ( id ){
        const referralLogs = await Sales_log.findAll({
          where : {
            id_referral: id
          }
        })
        return res.status(201).send(referralLogs)
      } else {
        const logs = await Sales_log.findAll();
        return res.status(201).send(logs)
      }
    } catch (error) {
      res.status(500).send(error.message)
    }
  }
}