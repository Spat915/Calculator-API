/**
 *	File Cloned: 2019-07-12
 *	Edited by: Darryl McQuade(2019 07 12)
 */
//	Imports
const http = require('http');

//	Constants
const PORT = 8080;
const HOST = '127.0.0.1';
const METHODS = 'GET, HEAD, POST, OPTIONS';
const CONTENT_TYPE = 'application/json';
const OPERATIONS = [
	{'operation': 'divide'},
	{'operation': 'multiply'},
	{'operation': 'add'},
	{'operation': 'subtract'}
];

//	Server Setup
const server = http.createServer( (req, res) => {
	if (!METHODS.split(', ').includes(req.method)) {
		console.log(req.method, ' not in METHODS');
		res.statusCode = 405;
		res.statusMessage = 'Method Not Allowed';
		res.end();
	}
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', METHODS);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	if (req.method === 'OPTIONS') {
		res.end();
		return;
	}
	res.setHeader('Content-Type', CONTENT_TYPE);
	if (req.method === 'POST') {
		let body = [];
		// console.log('Beginning POST');
		req.on('data', (chunk) => {
			body.push(chunk);
		}).on('end', () => {
			body = Buffer.concat(body).toString();
			if (body) {
				checkReq(req, body, (err) => {
					if (err) {
						postError(res, err, () => {
							// console.log('POST Error');
							res.end();
						});
					} else {
						let val = processReq(body);
						// console.log('Ending POST');
						res.end(JSON.stringify({'result': val}));
					}
				});
			}
		});
		
	} else if (req.method === 'GET') {
		// console.log('Ending GET');
		res.end(JSON.stringify(OPERATIONS));
	} else if (req.method === 'HEAD') {
		// console.log('Ending HEAD');
		res.end();
	}
});
server.listen(PORT, HOST, () => {
	console.info(`Server running at http://${HOST}:${PORT}/`);
});

const checkReq = (req, body, callback) => {
	if (req.headers['Content-Type'] === CONTENT_TYPE) {
		let reqContent = JSON.parse(body);
		let operations = reqContent.operations;
		let numbers = reqContent.operandi;
		
		if (numbers.length !== operations.length + 1) {
			callback('Invalid amount of either operations or operands.');
		}
		for (let i = 0; i < operations.length; i++) {
			if (!OPERATIONS.includes(operations[i])) {
				callback('Invalid operation name.');
			}
		}
	}
	callback(null);
};

const processReq = (body) => {
	// console.log('Processing...');
	let reqContent = JSON.parse(body);
	let operations = reqContent.operations;
	let numbers = reqContent.operandi;
	let dm = false;
	let index = 0;
	while (numbers.length > 1) {
		if (index < 0) {
			index = 0;
		}
		let first_operation = operations[index];
		if (operations.includes('divide') ||
				operations.includes('multiply')) {
			if (first_operation === 'divide') {
				numbers[index] = divide(numbers[index], numbers[index + 1]);
				operations.splice(index, 1);
				numbers.splice(index + 1, 1);
				// console.log(divide);
				// console.log(operations);
				// console.log(numbers);
				continue;
			}
			if (first_operation === 'multiply') {
				numbers[index] = multiply(numbers[index], numbers[index + 1]);
				operations.splice(index, 1);
				numbers.splice(index + 1, 1);
				// console.log(divide);
				// console.log(operations);
				// console.log(numbers);
				continue;
			}
			index++;
			continue;
		} else if (!dm) {
			index = 0;
			dm = true;
			continue;
		}
		if (operations.includes('add') ||
				operations.includes('subtract')) {
			if (first_operation === 'add') {
				numbers[index] = add(numbers[index], numbers[index + 1]);
				operations.splice(index, 1);
				numbers.splice(index + 1, 1);
				// console.log(divide);
				// console.log(operations);
				// console.log(numbers);
				continue;
			}
			if (first_operation === 'subtract') {
				numbers[index] = subtract(numbers[index], numbers[index + 1]);
				operations.splice(index, 1);
				numbers.splice(index + 1, 1);
				// console.log(divide);
				// console.log(operations);
				// console.log(numbers);
				continue;
			}
			index++;
			continue;
		}
	}
	// console.log('Done.');
	return numbers[0];
}

const divide = (a, b) => {
	return a/b;
}
const multiply = (a, b) => {
	return a*b;
}
const add = (a, b) => {
	return a+b;
}
const subtract = (a, b) => {
	return a-b;
}

const postError = (res, msg, callback) => {
	res.statusCode = 500;
	res.statusMessage = msg;
	if (callback) {
		callback();
	}
};
