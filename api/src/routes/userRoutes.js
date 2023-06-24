const express = require("express");
const { registerUser, confirm, getUsers } = require('../controllers/userController')
const router = express.Router();
router.use(express.json());

router.post("/", registerUser);
router.get("/", getUsers);
router.get("/confirm/:token", confirm);

module.exports = router;