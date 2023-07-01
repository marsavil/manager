const express = require("express");
const { registerUser, confirm, getUsers, loginUser, referralToAffiliate, deleteUser } = require('../controllers/userController')
const router = express.Router();
router.use(express.json());

router.post("/", registerUser);
router.post("/:id", referralToAffiliate);
router.delete("/:id", deleteUser);
router.get("/", getUsers);
router.get("/confirm/:token", confirm);
router.get("/login", loginUser);


module.exports = router; 