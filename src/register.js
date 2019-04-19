module.exports = {
	createRegister, register: createRegister()
};

function createRegister() {
	return {
		windows: {},
		lastWindows: {},
		add(windowId, {agentId,  title, URL}) {
			this.windows[windowId] = {agentId,  title, URL};
		},
		delete(windowId) {
			const window = this.getWindow(windowId);
	
			if (window) {
				this.lastWindows[window.agentId] = windowId;
		
				delete this.windows[windowId];
			}
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
}