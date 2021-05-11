var router = require('express').Router();
var auth = require('../auth');
var services = require('../../config/services')
var fs = require('fs');
const path = require('path');

function promiseAllP(items, block) {
	var promises = [];
	items.forEach(function(item,index) {
		promises.push( function(item,i) {
			return new Promise(function(resolve, reject) {
				return block.apply(this,[item,index,resolve,reject]);
			});
		}(item,index))
	});
	return Promise.all(promises);
}
function readFiles(dirname) {
	return new Promise((resolve, reject) => {
		fs.readdir(dirname, function(err, filenames) {
			if (err) return reject(err);
			promiseAllP(filenames,
				(filename,index,resolve,reject) =>  {
				console.log(dirname,filename)
					fs.readFile(path.resolve(dirname, filename), 'utf-8', function(err, content) {
						if (err) return reject(err);
						return resolve(JSON.parse(content));
					});
				})
				.then(results => {
					return resolve(results);
				})
				.catch(error => {
					return reject(error);
				});
		});
	});
}

router.get('/', function (req, res) {
	let path = `${process.cwd()}/config/services`
	console.log(path)
	readFiles(path).then(files=> {

		return res.status(200).json(files)
		}
	).catch(e => {
		console.error(e.message)
		return res.status(501)
	})

});

router.get('/service/:svc', auth.required, function(req, res, next){
	let svcId = req.params.svc;
	services.services.forEach((svc) => {
		if (svc.id === svcId) {
			return res.status(200).json(svc).end()
		}
	})
	return res.status(302)
});


module.exports = router;