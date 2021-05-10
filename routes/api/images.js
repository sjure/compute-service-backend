var router = require('express').Router();
var auth = require('../auth');
const multerConfig = require("../../config/multer");
const fs = require('fs');
const {services} = require("../../config/services");
const { exec } = require('child_process');


//multerConfig.saveToUploads
router.post('/',  auth.required,multerConfig.saveToUploads,(req, res) => {
	return res.json("file uploaded successfully");
});

router.get('/:svc',auth.required,(req, res) => {
	let svcId = req.params.svc;
	let service = {}
	services.forEach((svc) => {
		if (svc.id === svcId) {
			service = svc;
		}
	})
	if (Object.keys(service).length === 0){
		return res.status(302)
	}
	console.log(service)
	if( typeof req.query.name !== 'undefined' ) {
		console.log(req.query.name);
		let s = `wsl.exe ${service.executionString} ./uploads/${req.query.name} ./outputs/${req.query.name}`
		console.log("executing: " + s)
		exec(s, (err, stdout, stderr) => {
			if (err) {
				// node couldn't execute the command
				return;
			}
			// the *entire* stdout and stderr (buffered)
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
			var file = `${process.cwd()}/outputs/${req.query.name}`
			var s = fs.createReadStream(file);
			s.on('open', function () {
				res.set('Content-Type', null);
				s.pipe(res);
			});
			s.on('error', function () {
				res.set('Content-Type', 'text/plain');
				res.status(404).end('Not found');
			});
		});
	} else {
		console.error("undefined name");
		return res.status(401);
	}
});

module.exports = router;