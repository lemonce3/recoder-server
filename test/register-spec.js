const Store = require('../src/store');
const store = new Store();
const assert = require('assert');

describe('The Method of Store test', function () {
	const agentId = 1;
	const info = {URL: 'test', title: 'test'};

	let agent = null;
	let windowId;

	it('CreateAgent test', function () {
		agent = store.allocAgent(1);

		assert.equal(agentId, agent.id);
	});

	describe('The Method of agent', function () {
		describe('AllocWindow test', function () {
			it('Alloc a new window', function () {
				windowId = agent.allocWindow(info);

				assert.deepEqual(Object.assign({}, info, {
					id: windowId
				}), agent.windowList[windowId]);
			});

			it('Alloc lastest delete window', function () {
				agent.deleteWindow(windowId);

				windowId = agent.allocWindow(info);

				assert.deepEqual(Object.assign({}, info, {
					id: windowId
				}), agent.windowList[windowId]);
			});
		});

		describe('GetWindow test', function () {
			it('Get a exist window', function () {

				const window = agent.getWindow(windowId);
	
				assert.deepEqual(Object.assign({}, info, {
					id: windowId, agentId: agent.id
				}), window);
			});

			it('Get a not exist window', function () {
				const window = agent.getWindow();
	
				assert.equal(undefined, window);
			});
		});

		describe('deleteWindow test', function () {
			it('Delete a exist window', function () {
				agent.deleteWindow(windowId);

				assert.equal(windowId, agent.lastWindow);
			});

			it('Delete a not exist window', function () {
				agent.deleteWindow();
	
				assert.equal(windowId, agent.lastWindow);
			});
		});
	});
});