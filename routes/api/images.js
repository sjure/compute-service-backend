var router = require('express').Router();
var auth = require('../auth');
const multerConfig = require("../../config/multer");

const { exec } = require('child_process');


//multerConfig.saveToUploads
router.post('/', multerConfig.saveToUploads,(req, res) => {
	return res.json("file uploaded successfully");
});

router.get('/',(req, res) => {
	exec('pwd', (err, stdout, stderr) => {
		if (err) {
			// node couldn't execute the command
			return;
		}
		// the *entire* stdout and stderr (buffered)
		console.log(`stdout: ${stdout}`);
		console.log(`stderr: ${stderr}`);
	});
	return res.json("");
});

module.exports = router;