const express = require("express");
const router = express.Router();
router.use(express.json());
const { addLog, getLogs } = require('../controllers/logController');

router.post("/", addLog);
router.get("/", getLogs);
router.get("/:id", getLogs)

module.exports = router;