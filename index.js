const router = require('./src');
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

module.exports = function (options) {
	const {host, port, cache } = options;
	const app = new Koa();

	app.use(bodyparser());
	app.use(router.routes());

	app.context.$cache = cache;

	return app.listen(port, host);
};