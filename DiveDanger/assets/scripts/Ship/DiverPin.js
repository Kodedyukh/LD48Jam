import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {

        player: {
            default: null,
            type: cc.Node
        },
        
        _joint: {
            default: null
        },

        _playerPinned: {
            default: false
        },

        _playerInitialOffset: {
            default: cc.v2()
        },

        _pinStartAngle: {
            default: 0
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable () {
        this._joint = this.getComponent(cc.RevoluteJoint);

        this._handleSubscription(true);
    },

    update() {
        if (this._playerPinned) {
            const angleDelta = this.node.angle - this._pinStartAngle;
            const rotatedVec = cc.v2(this._playerInitialOffset).rotate(angleDelta / 180 * Math.PI);

            this.player.setPosition(rotatedVec);
        }
    },

    _handleSubscription(isOn) {
        const func = isOn? 'on': 'off';

        cc.systemEvent[func](GameEvent.PIN_DIVER, this.onPinDiver, this);
    },

    onPinDiver(isOn) {

        if (!this._playerPinned && isOn) {
            /*const player = this._joint.connectedBody.node;

            const toPlayerVec = player.position.sub(this.node);

            this._joint.connectedAnchor.x = -toPlayerVec.x;
            this._joint.connectedAnchor.y = -toPlayerVec.y;

            this._joint.enabled = true;*/
            this._pinStartAngle = this.node.angle;
            this._playerInitialOffset = this.player.position.sub(this.node);

            this.player.getComponent(cc.RigidBody).gravityScale = 0;
            this.player.getComponents(cc.PhysicsBoxCollider).forEach((collider) =>{
                if (collider.tag === 0) {
                    collider.sensor = true;
                }
            }, this);

            this._playerPinned = true;
        } else if (this._playerPinned && !isOn) {

            //this._joint.enabled = false;

            this.player.getComponent(cc.RigidBody).gravityScale = 0;
            this.player.getComponents(cc.PhysicsBoxCollider).forEach((collider) =>{
                if (collider.tag === 0) {
                    collider.sensor = false;
                }
            }, this);

            this._playerPinned = false;
        }
    }

    // update (dt) {},
});