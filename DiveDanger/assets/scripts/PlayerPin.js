import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
        
        _joint: {
            default: null
        },

        _playerPinned: {
            default: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable () {
        this._joint = this.getComponent(cc.RevoluteJoint);

        this._handleSubscription(true);
    },

    _handleSubscription(isOn) {
        const func = isOn? 'on': 'off';

        cc.systemEvent[func](GameEvent.PIN_PLAYER, this.onPinPlayer, this);
    },

    onPinPlayer(isOn) {

        if (!this._playerPinned && isOn) {
            const player = this._joint.connectedBody.node;

            //const playerGlobalPos = player.convertToWorldSpaceAR(cc.v2());
            //const localPos = this.node.parent.convertToNodeSpace(playerGlobalPos);

            const toPlayerVec = player.position.sub(this.node);

            this._joint.connectedAnchor.x = -toPlayerVec.x;
            this._joint.connectedAnchor.y = -toPlayerVec.y;

            this._joint.enabled = true;
            this._playerPinned = true;
        } else if (this._playerPinned && !isOn) {
            cc.log('turn off pin');
            this._joint.enabled = false;
            this._playerPinned = false;
        }
    }

    // update (dt) {},
});
