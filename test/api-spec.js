const createServer = require('../');
const config = {
	port: 8090, host: 'localhost',
	cache: []
};

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

				assert.equal(typeof windowId, 'string');
			});
		});

		it('DELETE the window and Create a new window after delete', function () {
			httpAgent.delete(`/window/${windowId}`, {
				timeout: 200
			}).catch((e) => {
				console.log(e);
			});
		});

		it('Create anothor new window', function () {
			setTimeout(function () {
				httpAgent.post('/window', info).then(({data}) => {
					const lastWindow = windowId;
	
					windowId = data;
	
					assert.equal(lastWindow, data);
				});
			}, 2000);
		});
	});

	describe('POST /window/:windowId/action', function () {
		const actionRetrive = {
			type: 'test', describe: 'test'
		};

		it('Failed to add action with 404', function () {
			httpAgent.post('/window/test/action', actionRetrive).then(() => {}).catch((e) => {
				assert.equal(e.response.status, 404);
			});
		});

		it('Failed to add action with 400', function () {
			httpAgent.post(`/window/${windowId}/action`).then(() => {}).catch(() => {});
		});

		it('Add action succeed', function () {
			httpAgent.post(`/window/${windowId}/action`, actionRetrive).then(() => {
				assert.deepEqual(config.cache[config.cache.length - 1].info, actionRetrive);
			});
		});
	});

	describe('DELETE /api/window/:id', function () {
		it('Failed to delete window', function () {
			httpAgent.delete('/window/test').catch((e) => {
				assert.equal(e.message, 'Request failed with status code 404');
			});
		});
	});
});