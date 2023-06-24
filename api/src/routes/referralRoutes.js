const express = require("express");
const router = express.Router();
router.use(express.json());
const { addReferral, getReferrals } = require('../controllers/referralController')

router.post("/", addReferral);
router.get("/", getReferrals);
router.get("/:id", getReferrals);


module.exports = router;