var router = require('express').Router();
var auth = require('../auth');
const multerConfig = require("../../config/multer");
const fs = require('fs');
const { exec } = require('child_process');


//multerConfig.saveToUploads
router.post('/', multerConfig.saveToUploads,(req, res) => {
	return res.json("file uploaded successfully");
});

router.get('/',(req, res) => {
	if( typeof req.query.name !== 'undefined' ) {
		console.log(req.query.name);
		let s = `wsl.exe programs/image-seq.out ./uploads/${req.query.name} ./outputs/${req.query.name}`
		console.log("executing :" + s)
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