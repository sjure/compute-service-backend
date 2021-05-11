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
		let execString = `${service.executionString}`
		Object.values(service.fields).forEach(value => {
			if (value.type === "file") {
				let name = req.payload.id + "."+ req.query.name.split(".")[1]
				if (value.input) {
					if (value.flag) {
						execString += ` ${value.flag} ./uploads/${name}`
					} else {
						execString += ` ./uploads/${name}`
					}
				} else {
					if (value.flag) {
						execString += ` ${value.flag} ./uploads/${name}`
					} else {
						execString += ` ./uploads/${name}`
					}
				}
			} else if (value.type === "text") {
				execString += ` ${value.flag} ${req.query[value.name]}`
			}
		})
		console.log("executing: " + execString)
		exec(execString, (err, stdout, stderr) => {
			if (err) {
				// node couldn't execute the command
				return;
			}
			// the *entire* stdout and stderr (buffered)
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);
			let file = `${process.cwd()}/outputs/${req.query.name}`
			res.sendFile(file);
		});
	} else {
		console.error("undefined name");
		return res.status(401);
	}
});

module.exports = router;