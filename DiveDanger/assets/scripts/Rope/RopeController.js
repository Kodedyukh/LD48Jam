import GameEvent from 'GameEvent';
import RopeType from 'RopeType';

cc.Class({
    extends: cc.Component,

    properties: {
        ropeType: {
            default: RopeType.Default,
            type: RopeType
        },

        connectionBody: {
            default: null,
            type: cc.RigidBody
        },

        submarineNode: {
            default: null,
            type: cc.Node
        },

        _constuctor: {
            default: null,
            serializable: false
        },

        _character: {
            default: null,
            serializable: false,
        },

        _isActiveRope: {
            default: false,
            serializable: false,
        },

        _initialOffset: {
            default: cc.v2(),
            serializable: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        this._handlerSubscribe(true);

        this._constuctor = this.getComponentInChildren('RopeConstructor');
        this._character = this.connectionBody.getComponent('CharacterInWater');

        this._initialOffset = this.node.position.clone();
    },

    onDisable() {
        this._handlerSubscribe(false);
    },

    _handlerSubscribe(isOn) {
        const func = isOn ? 'on' : 'off';

        cc.systemEvent[func](GameEvent.ROPE_TOGGLE, this.onRopeToggle, this);
    },

    _togglePhysics(isOn) {
        for (let part of this._constuctor._parts) {
			let body = part.getComponent(cc.RigidBody);

			body.awake = isOn;
			body.active = isOn;
		}
    },

    onRopeToggle(isOn, typeStr) {
        const type = Number(typeStr);
        //cc.log('rope toggle', isOn, typeStr);
        if (this.ropeType === type && isOn) {
            const newWorldPosition = this.submarineNode.convertToWorldSpaceAR(this._initialOffset);
            const newLocalPos = this.node.parent.convertToNodeSpaceAR(newWorldPosition);

            //cc.log(this._initialOffset.x, this._initialOffset.y);
            //cc.log('newLocalPos', newLocalPos.x, newLocalPos.y);

            //const delta = newLocalPos.sub(this.node.position);
            this.node.setPosition(newLocalPos);
            /*this._constuctor._parts.forEach((part) => {
                part.setPosition(cc.v2());
            })*/

            this._constuctor._ropeConstruct();

            this._character.node.setPosition(this.node.position);
            this._character.toggleActiveCharacter(true);

            this._togglePhysics(true);
            
            const endPart = this._constuctor._parts[this._constuctor._parts.length - 1];
            const joint = endPart.getComponent(cc.Joint);
            const rigidBody = this.connectionBody.getComponent(cc.RigidBody);
            joint.connectedBody = rigidBody;
            joint.apply(true);

            cc.tween(this.node).to(0.5, {opacity: 255}).start();
            cc.tween(this._character.node).to(0.5, {opacity: 255}).start();

        } else if (this.ropeType === type && !isOn){
            this._character.toggleActiveCharacter(false);
            cc.tween(this.node).to(0.5, {opacity: 0}).start();
            cc.tween(this._character.node).to(0.5, {opacity: 0}).start();

            const endPart = this._constuctor._parts[this._constuctor._parts.length - 1];
            const joint = endPart.getComponent(cc.Joint);
            joint.connectedBody = null;
            joint.apply();

            this._togglePhysics(false);

            this._constuctor._destroyRope();
        }
    }
});
