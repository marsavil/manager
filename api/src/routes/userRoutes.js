const express = require("express");
const { registerUser, confirm, getUsers, loginUser, referralToAffiliate, deleteUser, restoreUser, createManager } = require('../controllers/userController')
const { getAffiliateLink } = require ('../controllers/affiliateLinkController')
const router = express.Router();
router.use(express.json());

router.post("/", registerUser);
router.post("/:id", referralToAffiliate);
router.delete("/delete/:id", deleteUser);
router.put("/restore/:id", restoreUser);
router.get("/", getUsers);
router.get("/link/:id", getAffiliateLink);
router.get("/confirm/:token", confirm);
router.get("/login", loginUser);
router.get("/:id", getUsers);
router.put("/manager/add/:id", createManager);
router.post("/manager/add", createManager)


module.exports = router; 