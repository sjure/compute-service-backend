const fs = require('fs');
const path = require('path');

function promiseAllP(items, block) {
	let promises = [];
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
module.exports = readFiles;