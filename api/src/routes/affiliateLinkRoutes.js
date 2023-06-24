const express = require("express");
const router = express.Router();
router.use(express.json());
const { generateLink, getLinks } = require('../controllers/affiliateLinkController')

router.post("/", generateLink);
router.get("/", getLinks);
router.get("/:id", getLinks)

module.exports = router;