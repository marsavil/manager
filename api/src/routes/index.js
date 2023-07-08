const { Router } = require('express');
const referralRoutes = require('./referralRoutes')
const userTypesRoutes = require('./userTypesRoutes');
const affiliateLinkRoutes = require('./affiliateLinkRoutes')
const channelsRoutes = require('./channelsRoutes');
const userRoutes = require('./userRoutes')
const saleLogRoutes = require('./saleLogsRoutes')

const router = Router();

router.use("/userType", userTypesRoutes)
router.use("/referrals", referralRoutes)
router.use("/affiliateLink", affiliateLinkRoutes)
router.use("/channels", channelsRoutes)
router.use("/user", userRoutes)
router.use("/logs", saleLogRoutes)

module.exports = router;
