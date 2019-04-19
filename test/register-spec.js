const register = require('../src/register').createRegister();
const assert = require('assert');

describe('The Method of Register test', function () {
	const agentId = 1;
	const windowId = 1;
	const info = {agentId, URL: 'test', title: 'test'};

	describe('method add test', function () {
		it('The second argument is not an object', function () {
			register.add(windowId, 1);

			assert.deepEqual(register.windows, {
				[windowId]: {URL: undefined, agentId: undefined, title: undefined}
			});
		});

		it('The second argument is not an object', function () {
			register.add(windowId, info);

			assert.deepEqual(register.windows, {
				[windowId]: info
			});
		});
	});

	describe('method delete test', function () {
		it('The window is not exist', function () {
			register.delete('test');

			assert.deepEqual({
				windows: register.windows,
				lastWindows: register.lastWindows
			}, {
				windows: {
					[windowId]: info
				},
				lastWindows: {}
			});
		});

		it('The window is existed', function () {
			register.delete(windowId);

			assert.deepEqual({
				windows: register.windows,
				lastWindows: register.lastWindows
			}, {
				windows: {},
				lastWindows: {
					[agentId]: windowId
				}
			});
		});
	});

	describe('method allocateWindow test', function () {
		it('allocate last window', function () {
			const allocatedWindowId = register.allocateWindow(agentId);

			register.add(allocatedWindowId, info);

			assert.equal(allocatedWindowId, windowId);
		});

		it('allocate new window', function () {
			const allocatedWindowId = register.allocateWindow(agentId);

			assert.notEqual(allocatedWindowId, windowId);
		});
	});

	describe('method getWindow test', function () {
		it('get a exist window', function () {
			assert.equal(register.getWindow(), undefined);
		});

		it('get a not exist window', function () {
			assert.deepEqual(register.getWindow(windowId), info);
		});
	});
});