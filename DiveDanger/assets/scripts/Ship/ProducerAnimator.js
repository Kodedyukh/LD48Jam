import GameEvent from 'GameEvent';
// helpers

cc.Class({
	extends: cc.Component,

	properties: {
		//visible
		brokenAnimationName: {
			default: '',
		},

		fixAnimationName: {
			default: '',
		},

		//public
		producer: {
			default: null,
			visible: false
		},

		//private
		_isRepair: {
			default: false,
			serializable: false
		},

		_animation: {
			default: null,
			serializable: false
		},

		_sprite: {
			default: null,
			serializable: false
		},

		_alarmTween: {
			default: null,
			serializable: false
		}
	},

	// LIFE-CYCLE CALLBACKS:

	onEnable() {
		this._sprite = this.getComponentInChildren(cc.Sprite);
		this._animation = this.getComponent(cc.Animation);
	},

	update (dt) {
		if (this._isRepair) {
			this.producer.repair(dt);
		}
	},

	// public methods
	break() {
		cc.log('break in producer animator')
		this._animation && this._animation.play(this.brokenAnimationName);
	},

	fix() {
		this._animation && this._animation.play(this.fixAnimationName);
	},

	startRepair() {
		cc.log('start repair');
		this._isRepair = true;
        cc.systemEvent.emit(GameEvent.TOGGLE_REPAIR_BAR, true);
	},

	stopRepair() {
		cc.log('stop repair');
		this._isRepair = false;
        cc.systemEvent.emit(GameEvent.TOGGLE_REPAIR_BAR, false);
	}

	// private methods

	// callbacks
});
