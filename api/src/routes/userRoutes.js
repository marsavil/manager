const express = require("express");
const { registerUser, confirm, getUsers, loginUser, referralToAffiliate } = require('../controllers/userController')
const router = express.Router();
router.use(express.json());

router.post("/", registerUser);
router.post("/:id", referralToAffiliate);
router.get("/", getUsers);
router.get("/confirm/:token", confirm);
router.get("/login", loginUser);


module.exports = router; 