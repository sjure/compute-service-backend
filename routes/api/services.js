var router = require('express').Router();
var auth = require('../auth');
var services = require('../../config/services')

router.get('/', auth.required, function (req, res) {
	return res.status(200).json(services.services)
});

router.get('/service/:svc', auth.required, function(req, res, next){
	let svcId = req.params.svc;
	services.services.forEach((svc) => {
		if (svc.id === svcId) {
			return res.status(200).json(svc).end()
		}
	})
	return res.status(302)
});


module.exports = router;