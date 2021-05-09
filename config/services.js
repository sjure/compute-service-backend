var fields = require('./fields')
const services = [
	{
		name: "Image Processing",
		path: "image-seq.out",
		fields:[fields.image]
	}
]
module.exports = {
	services:services,
}