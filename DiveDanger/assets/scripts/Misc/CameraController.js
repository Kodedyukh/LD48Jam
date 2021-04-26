import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
        _camera: {
            default: null,
            serializable: false
        },

        _isInTurret: {
            default: false,
            serializable: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable () {
        this._camera = this.getComponent(cc.Camera);

        this._handleSubscription(true);
    },

    _handleSubscription(isOn) {
        const func = isOn? 'on': 'off';

        cc.systemEvent[func](GameEvent.TURRET_ENTER, this.onTurretEnter, this);
    },

    onTurretEnter(isOn) {
        if (isOn && !this._isInTurret) {
            cc.tween(this._camera)
                .to(1, {zoomRatio: 0.5})
                .start();
            this._isInTurret = true;
        } else if (this._isInTurret && !isOn) {
            cc.tween(this._camera)
                .to(1, {zoomRatio: 1})
                .start();
            this._isInTurret = false;
        }
    }

    // update (dt) {},
});
