var router = require('express').Router();
var auth = require('../auth');
const multerConfig = require("../../config/multer");
const fs = require('fs');
const readFiles = require("../readFiles");
const {exec} = require('child_process');


//multerConfig.saveToUploads
router.post('/', auth.required, multerConfig.saveToUploads, (req, res) => {
	return res.json("file uploaded successfully");
});

router.get('/:svc', auth.required, async (req, res) => {
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
	if (Object.keys(service).length === 0) {
		return res.status(302)
	}
	console.log(service)
	if (true) {
		console.log();
		let execString = `${service.executionString}`
		Object.values(service.fields).forEach(value => {
			if (value.type === "file") {
				let name = req.payload.id + "." + value.format
				if (value.input) {
					if (value.flag) {
						execString += ` ${value.flag} ./uploads/${name}`
					} else {
						execString += ` ./uploads/${name}`
					}
				} else {
					if (value.flag) {
						execString += ` ${value.flag} ./outputs/${name}`
					} else {
						execString += ` ./outputs/${name}`
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

			console.log(service.fileOutput)
			if (service.fileOutput) {
				let outputFiles = Object.values(service.fields).filter(x => x.type === "file" && !x.input)
				if (outputFiles.length !== 1) {
					res.status(500)
					return;
				}
				let name = req.payload.id + "." + outputFiles[0].format
				let file = `${process.cwd()}/outputs/${name}`
				res.status(200).sendFile(file);
			} else {
				res.status(200).json(stdout);
			}

		});
	} else {
		console.error("undefined name");
		return res.status(401);
	}
});

module.exports = router;