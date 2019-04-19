const Router = require('koa-router');

const router = module.exports = new Router({prefix: '/api'});
const register = require('./register').register;

router.post('/window', ctx => {
	const {request, STORE} = ctx;

	const { agentId,  title, URL} = request.body;

	if (!(agentId && title && URL)) {
		return ctx.throw(400, 'The "agentId" and "title" and "URL" is must.');
	}

	//closeWindow和openWindow是在动作分析的时候出现的动作
	const windowId = register.allocateWindow(agentId); 
	
	register.add(windowId, {agentId,  title, URL});

	STORE.push({
		agentId, windowId, info: {
			type: 'jumpTo',
			describe: {
				title, URL
			}
		}
	});

	ctx.body = windowId;
});

router.del('/window/:windowId', validateWindow, ctx => {
	const {STORE, params} = ctx;

	const {windowId} = params;
	const {agentId, title, URL} = ctx.data;

	ctx.res.setTimeout(0);

	return new Promise(resolve => {
		ctx.req.on('aborted', () => {
			register.delete(windowId);

			STORE.push({
				agentId, windowId, info: {
					type: 'closeWindow',
					describe: {
						title, URL
					}
				}
			});

			resolve();
		});
	});
});

router.post('/window/:windowId/action', validateWindow, ctx => {
	const {request, STORE, params} = ctx;

	const action = request.body;
	const {windowId} = params;
	const window = ctx.data;

	if (!(action.type && action.describe)) {
		return ctx.throw(400, 'The "type" and "describe" is must.');
	}

	STORE.push({
		agentId: window.agentId,
		windowId, info: action
	});

	ctx.status = 200;
});

async function validateWindow(ctx, next) {
	const {windowId} = ctx.params;
	const window = register.getWindow(windowId);

	if (!window) {
		return ctx.throw(404, 'The window is not existed.');
	}

	ctx.data = window;

	await next();
}