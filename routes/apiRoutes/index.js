const router = require('express').Router();

router.use(require('./noteRoutes'));
router.use(require('./uuidRoutes'));

module.exports = router;