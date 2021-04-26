import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
        fillerSprite: { default: null, type: cc.Sprite },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._handleSubscription(true);
    },

    // update (dt) {},

	_handleSubscription(isOn) {
		const func = isOn ? 'on' : 'off';

        cc.systemEvent[func](GameEvent.TOGGLE_REPAIR_BAR, this.onToggleRepairBar, this);
        cc.systemEvent[func](GameEvent.UPDATE_REPAIR_BAR, this.onUpdateRepairBar, this);
	},

    onToggleRepairBar(isOn) {
        this.node.opacity = isOn ? 255 : 0;

        let parent = this.node.parent;
        let fullScaleX = 1;

        while(parent) {
            fullScaleX *= parent.scaleX;
            parent = parent.parent;
        }

        if (fullScaleX < 0) this.node.scaleX = -1;
        else this.node.scaleX = 1;
    },

    onUpdateRepairBar(value) {
        this.fillerSprite.fillRange = value;
    }
});
