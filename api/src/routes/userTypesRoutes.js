const express = require("express");
const { chargeUserTypes, getUserTypes, editUserTypes, deleteUserType } = require('../controllers/userTypeController.js')
const router = express.Router();
router.use(express.json());

router.post("/", chargeUserTypes);
router.get("/", getUserTypes);
router.put("/edit", editUserTypes);
router.delete("/delete", deleteUserType);

module.exports = router;
