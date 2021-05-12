var router = require('express').Router();
var auth = require('../auth');
const readFiles = require("../readFiles");

router.get('/',  auth.required,function (req, res) {
	let path = `${process.cwd()}/config/services`
	console.log(path)
	readFiles(path).then(files=> {
		return res.status(200).json(files)
		}
	).catch(e => {
		console.error(e.message)
		return res.status(501)
	})

});

router.get('/service/:svc', auth.required,async function(req, res, next){
	let svcId = req.params.svc;
	let path = `${process.cwd()}/config/services`
	console.log(path)
	services = await readFiles(path)
	let found = false
	services.forEach((svc) => {
		if (svc.id === svcId) {
			found =true
			return res.status(200).json(svc)
		}
	})
	if (!found) return res.status(302)
});


module.exports = router;