const multer  = require('multer');

const diskStorageToUploads = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/')
	},
	filename: (req, file, cb) => {
		cb(null, req.payload.id + "."+ file.originalname.split(".")[1])
	}
});

const saveToUploads = multer({storage: diskStorageToUploads});

module.exports = {
	saveToUploads: saveToUploads.single('file')
}