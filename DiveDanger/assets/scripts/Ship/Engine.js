import GameEvent from 'GameEvent';
import EngineType from 'EngineType';

cc.Class({
    extends: cc.Component,

    properties: {
        // visible
        damage: {
            default: 10
        },

        type: {
            default: EngineType.None,
            type: EngineType
        },

        repairSpeed: {
            default: 10
        },

        //public
        hp: {
            default: 100,
            visible: false
        },

        isBroken: {
            default: false,
            visible: false,
            notify() {
                if (this.isBroken) {
                    this._animation && this._animation.play('engine_broken');
                    if (this._isActive) {
                        this._isActive = false;
                        cc.systemEvent.emit(GameEvent.SWITCH_ENGINE, this._isActive);
                    }
                } else {
                    this._animation && this._animation.play('engine_fixed');
                }
            }
        },

        // private
        _body: {
            default: null,
            serializable: false
        },

        _isRepair: {
            default: false,
            serializable: false
        },

        _animation: {
            default: null,
            serializable: false
        },

        _isActive: {
            default: true,
            serializable: false
        }
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable() {
        this._body = this.getComponent(cc.RigidBody);
        this._animation = this.getComponent(cc.Animation);
        this._handleSubscription(true);
    },

    update(dt) {
        if (this._isRepair) {
            this.hp = Math.min(100, this.hp + this.repairSpeed * dt);

            if (this.hp === 100 && this.isBroken) {
                this.stopRepair();
                this.isBroken = false;
                cc.systemEvent.emit(GameEvent.ENGINE_FIXED, this.type);
            }

            cc.systemEvent.emit(GameEvent.UPDATE_REPAIR_BAR, this.hp / 100);
        }
    },

    startRepair() {
        this._isRepair = true;
        cc.systemEvent.emit(GameEvent.TOGGLE_REPAIR_BAR, true);
    },

    stopRepair() {
        this._isRepair = false;
        cc.systemEvent.emit(GameEvent.TOGGLE_REPAIR_BAR, false);
    },

    switchEngine(isOn) {
        if (!this.isBroken && this._animation) {
            this._isActive = isOn;
            cc.systemEvent.emit(GameEvent.SWITCH_ENGINE, this._isActive);

            if (isOn) {
                this._animation && this._animation.play('engine_is_running');
            } else {
                this._animation.pause();
            }
        }
    },

    _handleSubscription(isOn) {

    },

    onBeginContact(contact, selfCollider, otherCollider) {
        const otherGroupName = otherCollider.node.group;

        switch (otherGroupName) {
            case 'enemy_bullet':
                this.hp = Math.max(0, this.hp - this.damage);
                if (this.hp === 0 && !this.isBroken) {
                    this.isBroken = true;
                    cc.systemEvent.emit(GameEvent.ENGINE_BROKEN, this.type);
                }
                break;
        }
    }

    // update (dt) {},
});
