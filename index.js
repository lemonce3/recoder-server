const Koa = require('koa');
const http = require('http');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const EventEmitter = require('events');
const rawProvider = exports.rawProvider = new EventEmitter();

const app = new Koa();
const router = new Router({ prefix: '/api' });

router.post('/snapshot', ctx => {
	const snapshot = ctx.request.body;
	
	rawProvider.emit('receive-snapshot', snapshot);
	ctx.status = 200;
});

router.post('/action', ctx => {
	const action = ctx.request.body;
	
	if (!(action.type && action.data.rect)) {
		return ctx.throw(400, 'The "type" and "data.rect" is must.');
	}
	
	rawProvider.emit('receive-action', action);
	ctx.status = 200;
});

app.use(bodyparser());
app.use(router.routes());

const server = http.createServer(app.callback());

exports.recorderServer = server;