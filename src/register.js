module.exports = {
	windows: {},
	lastWindows: {},
	add(agentId, windowId) {
		this.windows[windowId] = agentId;
	},
	delete(windowId) {
		const agentId = this.getWindow(windowId);

		this.lastWindows[agentId] = windowId;

		delete this.getWindow(windowId);
	},
	getWindow(windowId) {
		return this.windows[windowId];
	},
	allocateWindow(agentId) {
		const windowId = this.lastWindows[agentId];

		if (windowId) {
			delete this.lastWindows[agentId];

			return windowId;
		}

		return Math.random().toString(16).substr(2, 8);
	}
};