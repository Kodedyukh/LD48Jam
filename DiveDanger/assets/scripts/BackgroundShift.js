import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
        render: { default: null, type: cc.Node },
        shining: { default: null, type: cc.Node },
        light: { default: null, type: cc.Node },
        dark: { default: null, type: cc.Node },

        engineCount: 6,
        animations: { default: [], type: cc.Animation },

        _currentSpeed: { default: 1, serializable: false }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._handleSubscription(true);
    },

    update (dt) {
        if (this.render) {
            this.render.opacity += dt * this._currentSpeed * 2;
        }
        if (this.shining) {
            this.shining.opacity += dt * this._currentSpeed / 15;
        }
        if (this.light) {
            this.light.opacity -= dt * this._currentSpeed / 20;
        }
        if (this.dark) {
            this.dark.opacity += dt * this._currentSpeed;
        }
    },

    _handleSubscription(isOn) {
        const func = isOn ? 'on' : 'off';

        cc.systemEvent[func](GameEvent.SWITCH_ENGINE, this.onSwitchEngine, this);
    },

    onSwitchEngine(isActive) {
        this._currentSpeed += (1 / this.engineCount) * (isActive ? 1 : -1); 
        this.animations.forEach(a => {
            a.getAnimationState(a._clips[0].name).speed = this._currentSpeed;
        });
    }
});
