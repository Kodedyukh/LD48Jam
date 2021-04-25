import GameEvent from 'GameEvent';

cc.Class({
	extends: cc.Component,

	properties: {
		// privat
		_isDiverIn: {
			default: true
		}
	},

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},

	// callbacks
	onBeginContact(contact, self, other) {
		const otherGroupName = other.node.group;
		switch(otherGroupName){
			case 'diver': {
				if (!this._isDiverIn) {
					cc.systemEvent.emit(GameEvent.DIVER_ENTER, true);
					this._isDiverIn = true;
				}

			} break;
		}
	},

	onEndContact(contact, self, other) {
		const otherGroupName = other.node.group;
		switch(otherGroupName){
			case 'diver': {
				if (this._isDiverIn) {
					cc.systemEvent.emit(GameEvent.DIVER_ENTER, false);
					this._isDiverIn = false;
				}
			} break;
		}
	}
});
