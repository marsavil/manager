const { Channel } = require('../db')

module.exports = {
  chargeChannels: () => {
    const channels = [ "phone", "WhatsApp", "mail", "insite" ]
    try {
      channels.forEach(async (channel) => {
        const channelDB = await Channel.findOne({
          where: {
            type: channel
          }
        })
        if (!channelDB) {
          Channel.create({
            type: channel,
          })
        }
      })
      console.log('Channels charged in DB')
    } catch (error) {
      console.log(error.message)
    }
  },
  getChannels: async(req, res) => {
    try {
      const channels = await Channel.findAll()
      res.status(201).json(channels)
    } catch (error) {
      res.send(error.message)
    }
  },
}