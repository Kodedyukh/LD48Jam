import GameEvent from 'GameEvent';
import Engine from 'Engine';

cc.Class({
    extends: cc.Component,

    properties: {
        // private
        _engine: {
            default: null,
            serializable: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        this._engine = this.getComponent(Engine);
    },

    startRepair() {
        this._engine && this._engine.startRepair();
    },

    stopRepair() {
        this._engine && this._engine.stopRepair();
    }

    // update (dt) {},
});
