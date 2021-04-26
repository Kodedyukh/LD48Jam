import GameEvent from 'GameEvent';

cc.Class({
	extends: cc.Component,

	properties: {
		_firstEngineBroken: {
			default: false,
			serializable: false
		},

		_tutorOn: {
			default: false,
			serializable: false
		}
	},

	// LIFE-CYCLE CALLBACKS:

	onEnable() {
		this._handleSubscription(true);
	},

	start () {

	},

	_handleSubscription(isOn) {
		const func = isOn? 'on': 'off';

		//cc.systemEvent[func](GameEvent.ENGINE_BROKEN, this.onEngineBroken, this);
	},

	// callbacks

	onEngineBroken() {
		if (!this._firstEngineBroken && !this._tutorOn) {
			cc.systemEvent.emit(GameEvent.TOGGLE_PAUSE, true);

			this._firstEngineBroken = true;
			this._tutorOn = true;

			this.scheduleOnce(() => {
				cc.systemEvent.emit(GameEvent.TOGGLE_PAUSE, false);
			}, 3)
		}
	}
});
