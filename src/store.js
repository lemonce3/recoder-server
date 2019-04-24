module.exports = class Store {
	constructor() {
		this.agentList = {};
	}

	allocAgent(id) {
		if (this.agentList[id]) {
			return this.agentList[id];
		}

		this.agentList[id] = new Agent(id);

		return this.agentList[id];
	}
};

class Agent {
	constructor(id) {
		this.id = id;
		this.windowList = {};
		this.lastWindow = null;
	}

	allocWindow({title, URL}) {
		let id = Math.random().toString(16).substr(2, 8);

		if (this.lastWindow) {
			id = this.lastWindow;

			this.lastWindow = null;
		}

		this.windowList[id] = {
			id, title, URL
		};

		return id;
	}

	getWindow(id) {
		if (this.windowList[id]) {
			return Object.assign({}, {
				agentId: this.id
			}, this.windowList[id]);
		}
	}

	deleteWindow(id) {
		const window = this.getWindow(id);

		if (window) {
			this.lastWindow = window.id;

			delete this.windowList[id];
		}
	}
}