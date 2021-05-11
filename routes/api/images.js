var router = require('express').Router();
var auth = require('../auth');
const multerConfig = require("../../config/multer");
const fs = require('fs');
const readFiles = require("../readFiles");
const { exec } = require('child_process');


//multerConfig.saveToUploads
router.post('/',  auth.required,multerConfig.saveToUploads,(req, res) => {
	return res.json("file uploaded successfully");
});

router.get('/:svc',auth.required,async (req, res) => {
	let svcId = req.params.svc;
	console.log(req.payload.id)
	let service = {}
	let path = `${process.cwd()}/config/services`
	let services = await readFiles(path)
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
		console.log();
		let name = req.payload.id + "."+ req.query.name.split(".")[1]
		let s = `${service.executionString} ./uploads/${name} ./outputs/${name}`
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