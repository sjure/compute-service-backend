var fields = require('./fields')
const services = [
	{
		fullName: "Image Processing Sequential",
		id: "img-sq",
		path: "image-seq.out",
		fields:[fields.image]
	}
]
module.exports = {
	services:services,
}