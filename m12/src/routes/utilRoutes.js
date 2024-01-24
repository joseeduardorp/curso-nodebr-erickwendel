const { join } = require('node:path');

const BaseRoute = require('./base/baseRoute');

class UtilRoutes extends BaseRoute {
	coverage() {
		return {
			path: '/coverage/{param*}',
			method: 'GET',
			options: {
				cors: true,
				auth: false,
			},
			handler: {
				directory: {
					path: join(__dirname, '../../coverage'),
					redirectToSlash: true,
					index: true,
				},
			},
		};
	}
}

module.exports = UtilRoutes;
