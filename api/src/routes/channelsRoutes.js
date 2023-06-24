const express = require("express");
const router = express.Router();
router.use(express.json());
const { chargeChannels, getChannels } = require('../controllers/channelsController')

router.post("/", chargeChannels);
router.get("/", getChannels);

module.exports = router;