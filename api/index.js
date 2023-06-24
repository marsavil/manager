
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { chargeUserTypes } =  require( './src/controllers/userTypeController.js')
const { chargeChannels } = require('./src/controllers/channelsController.js')

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  server.listen(3001, () => {
    console.log('server listening on port 3001'); // eslint-disable-line no-console
  });
  chargeUserTypes()
  chargeChannels()
});
