var fields = require('./fields')
const services = [
	{
		fullName: "Image Processing Sequential",
		id: "img-sq",
		path: "image-seq.out",
		executionString: "programs/image-seq.out",
		fields:[fields.image]
	},
	{
		fullName: "Image Processing OMP max processors",
		id: "img-omp",
		path: "cp2.out",
		executionString: "programs/cp2.out",
		fields:[fields.image]
	},
	{
		fullName: "Image Processing MPI 8 processes",
		id: "img-mpi",
		path: "parmpi.out",
		executionString: "mpirun -np 8 programs/parmpi.out",
		fields:[fields.image]
	},
]
module.exports = {
	services:services,
}