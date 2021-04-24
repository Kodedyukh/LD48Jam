import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
        parts: { default: [], type: cc.Node },

        _rotationSpeed: { default: 0, serializable: false }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._handleSubscription(true);
    },

    start () {

    },

    update (dt) {
        this.parts.forEach(n => n.angle += this._rotationSpeed);
    },

    _handleSubscription(isOn) {
        const func = isOn ? 'on' : 'off';

        cc.systemEvent[func](GameEvent.SET_SUBMARINE_ROTATION, this.onSetSubmarineRotation, this);
    },

    onSetSubmarineRotation(speed) {
        this._rotationSpeed = speed;
    }
});
