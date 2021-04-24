import GameEvent from 'GameEvent';
import CooperationArea from 'CooperationArea';

const PlayerInputsHelper = cc.Class({
    name: 'PlayerInputsHelper',
    properties: {
        left: false,
        right: false,
        top: false,
        use: false
    },
})

cc.Class({
    extends: cc.Component,

    properties: {
        runVelocity: 100,
        jumpVelocity: 100,
        useDuration: 3,

        inputs: { default() { return new PlayerInputsHelper() }, type: PlayerInputsHelper, visible: false },

        _body: { default: null, serializable: false },
        _cooperationArea: { default: null, serializable: false },
        _isJumping: { default: false, serializable: false },
        _useDuration: { default: 0, serializable: false }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._body = this.getComponent(cc.RigidBody);
        this._handleSubscription(true); 
    },

    start () {

    },

    update (dt) {
        const velocity = cc.v2(0, this._body.linearVelocity.y);
        if (this.inputs.left) velocity.x -= this.runVelocity;
        if (this.inputs.right) velocity.x += this.runVelocity;
        if (this.inputs.top && !this._isJumping) {
            this._isJumping = true;
            velocity.y += this.jumpVelocity;
        }

        if (this.inputs.use) {
            this._useDuration += dt;
            if (this._useDuration > this.useDuration) {
                this.inputs.use = false;
                if (this._cooperationArea) {
                    this._cooperationArea.emitEvent();
                }
            }
        } else {
            this._useDuration = 0;
        }

        this._body.linearVelocity = velocity;
    },

    _handleSubscription(isOn) {
        const func = isOn ? 'on' : 'off';

        cc.systemEvent[func](GameEvent.LEFT_BUTTON_PRESSED, this.onLeftButtonPressed, this);
        cc.systemEvent[func](GameEvent.LEFT_BUTTON_RELEASED, this.onLeftButtonReleased, this);

        cc.systemEvent[func](GameEvent.RIGHT_BUTTON_PRESSED, this.onRightButtonPressed, this);
        cc.systemEvent[func](GameEvent.RIGHT_BUTTON_RELEASED, this.onRightButtonReleased, this);

        cc.systemEvent[func](GameEvent.UP_BUTTON_PRESSED, this.onUpButtonPressed, this);
        cc.systemEvent[func](GameEvent.UP_BUTTON_RELEASED, this.onUpButtonReleased, this);

        cc.systemEvent[func](GameEvent.USE_BUTTON_PRESSED, this.onUseButtonPressed, this);
        cc.systemEvent[func](GameEvent.USE_BUTTON_RELEASED, this.onUseButtonReleased, this);
    },

    onLeftButtonPressed() {
        this.inputs.left = true;
    },
    onLeftButtonReleased() {
        this.inputs.left = false;
    },
    onRightButtonPressed() {
        this.inputs.right = true;
    },
    onRightButtonReleased() {
        this.inputs.right = false;
    },
    onUpButtonPressed() {
        this.inputs.top = true;
    },
    onUpButtonReleased() {
        this.inputs.top = false;
    },

    onUseButtonPressed() {
        this.inputs.use = true;
    },
    onUseButtonReleased() {
        this.inputs.use = false;
    },

    onBeginContact(contact, self, other) {
        otherGroupName = other.node.group;
        switch(otherGroupName){
            case 'cargo_borders': {
                if (contact.getManifold().points.length === 0)
                    this._isJumping = false;
            } break;
            case 'cooperation_area': {
                this._cooperationArea = other.node.getComponent(CooperationArea);
            } break;
        }
    },

    onEndContact(contact, self, other) {
        otherGroupName = other.node.group;
        switch(otherGroupName){
            case 'cooperation_area': {
                this._cooperationArea = null;
            } break;
        }
    }
});
