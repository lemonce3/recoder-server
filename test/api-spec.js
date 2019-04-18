const createServer = require('../');
const config = {
	port: 8090, host: '0.0.0.0',
	store: []
};
const Register = require('../src/register');
const assert = require('assert');

createServer(config);

const axios = require('axios');

describe('API TEST', function () {
	const httpAgent = axios.create({ baseURL: `http://${config.host}:${config.port}/api` });
	let windowId;

	describe('POST /api/window', function () {
		const info = {
			agentId: 1, title: 'test', URL: 'test'
		};

		it('Failed to create window ', function () {
			httpAgent.post('/window').catch(e => {
				assert.equal(e.message, 'Request failed with status code 400');
			});
		});

		it('Create a window succeed', function () {
			httpAgent.post('/window', info).then(({data}) => {
				windowId = data;

				assert.equal(Register.windows[data], info.agentId);
			});
		});

		//abort怎么办？
		// it('DELETE the window', function () {
		// 	httpAgent.delete(`/window/${windowId}`).catch(() => {
		// 		assert.equal(Register.lastWindows[info.agentId], windowId);
		// 	});
		// });

		// it('Create a new window after delete', function () {
		// 	httpAgent.post('/window', info).then(({data}) => {
		// 		assert.equal(Register.lastWindows[info.agentId], data);
		// 	});
		// });

		it('Create anothor new window', function () {
			httpAgent.post('/window', info).then(({data}) => {
				assert.notEqual(Register.lastWindows[info.agentId], data);
			});
		});
	});

	describe('DELETE /api/window/:id', function () {
		it('Failed to delete window', function () {
			httpAgent.delete('/window/test').catch((e) => {
				assert.equal(e.message, 'Request failed with status code 404');
			});
		});

		it('DELETE the window succeed', function () {
			httpAgent.delete(`/window/${windowId}`).then(() => {
				assert.equal(Register.windows[windowId], undefined);
			});
		});
	});

	describe('POST /action', function () {
		const actionRetrive = {
			agentId: 1, windowId: 1, eventInfo: {
				type: 'test'
			}
		};

		it('Failed to add action', function () {
			httpAgent.post('/action').catch((e) => {
				assert.equal(e.message, 'Request failed with status code 400');
			});
		});

		it('Add action succeed', function () {
			httpAgent.post('/action', actionRetrive).then(() => {
				console.log(config.store);
			});
		});
	});
});