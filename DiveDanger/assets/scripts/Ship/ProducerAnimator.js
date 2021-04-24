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

	toggleRepair(isOn) {
		if (isOn && !this._isRepair) {
			this._isRepair = true;
		} else if (!isOn && this._isRepair) {
			this._isRepair = false;
		}
	}

	// private methods

	// callbacks
});
