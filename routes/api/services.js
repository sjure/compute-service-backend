var router = require('express').Router();
var auth = require('../auth');
var services = require('../../config/services')

router.get('/',(req, res) => {
	res.status(200).json(services.services)
});

module.exports = router;