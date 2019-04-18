const router = require('./src');

module.exports = function (options) {
	const {host, port, store } = options;

	const Koa = require('koa');
	const bodyparser = require('koa-bodyparser');

	const app = new Koa();

	app.use(bodyparser());
	app.use(router.routes());

	app.context.STORE = store;

	app.listen(port, host);
};