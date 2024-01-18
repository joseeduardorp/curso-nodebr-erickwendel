const http = require('node:http');

http
	.createServer((request, response) => {
		response.end('Hello Node!!!');
	})
	.listen(5000, () =>
		console.log('Server is running at http://localhost:5000')
	);
