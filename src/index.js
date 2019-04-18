const Router = require('koa-router');

const router = module.exports = new Router({prefix: '/api'});
const Register = require('./register');

router.post('/window', ctx => {
	const {request, STORE} = ctx;

	const { agentId,  title, URL} = request.body;

	if (!(title && URL)) {
		return ctx.throw(400, 'Bad Request');
	}

	const windowId = Register.allocateWindow(agentId);  //closeWindow和openWindow是在动作分析的时候出现的动作
	
	Register.add(agentId, windowId);

	STORE.push({
		agentId, windowId, eventInfo: {
			type: 'jumpTo',
			describe: {
				title, URL
			}
		}
	});

	ctx.body = windowId;
});

router.del('/window/:id', ctx => {
	const {id} = ctx.params;
	const window = Register.getWindow(id);

	if (!window) {
		return ctx.throw(404, 'The window is not existed.');
	}

	ctx.res.setTimeout(0);

	return new Promise(resolve => {
		ctx.req.on('aborted', () => {
			Register.delete(id);

			resolve();
		});
	});
});

router.post('/action', ctx => {
	const {request, STORE} = ctx;

	const {agentId, windowId, eventInfo} = request.body;

	if (!(agentId && windowId && eventInfo)) {
		return ctx.throw(400, 'Bad Request');
	}

	STORE.push({
		agentId, windowId, eventInfo
	});

	ctx.status = 200;
});