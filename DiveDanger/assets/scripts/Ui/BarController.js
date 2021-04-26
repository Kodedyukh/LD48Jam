import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
        eventForChangeValue: {
            default: GameEvent.NONE,
            type: GameEvent
        },

        spriteFilled: {
            default: null,
            type: cc.Sprite
        }
    },

    onEnable() {
        this._handlerSubscribe(true);
    },

    onDisable() {
        this._handlerSubscribe(false);
    },

    _handlerSubscribe(isOn) {
        const func = isOn ? 'on' : 'off';

        cc.systemEvent[func](this.eventForChangeValue, this.onChangeValue, this);
    },

    onChangeValue(value) {
        this.spriteFilled.fillRange = value / 100;
    }
});
