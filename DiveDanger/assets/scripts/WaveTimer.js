import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
        _sprite: {
            default: null,
            serializable: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable() {
        this._sprite = this.getComponent(cc.Sprite);

        this._handleSubscription(true);
    },

    _handleSubscription(isOn) {
        const func = isOn? 'on': 'off';

        cc.systemEvent[func](GameEvent.TIME_TO_WAVE, this.onTimeToWave, this);
    },

    onTimeToWave(timeParam) {
        this._sprite.fillRange = timeParam;
    }
});
