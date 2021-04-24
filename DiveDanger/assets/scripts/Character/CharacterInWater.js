import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
        velocity: {
            default: 10,
            type: cc.Integer
        },

        _body: {
            default: null,
            serializable: false
        }
    },

    onEnable() {
        this._body = this.getComponent(cc.RigidBody);

        this._handlerSubscribe(true);    
    },

    onDisable() {
        this._handlerSubscribe(false);    
    },
    
    _handlerSubscribe(isOn) {
        const func = isOn ? 'on' : 'off';

        cc.systemEvent[func](GameEvent.CHARACTER_MOVE_START, this.onCharacterMoveStart, this);
        cc.systemEvent[func](GameEvent.CHARACTER_MOVE_END, this.onCharacterMoveEnd, this);
    },

    onCharacterMoveStart(direction) {
        // const x = this._body.linearVelocity.x + direction.x * this.velocity;
        // const y = this._body.linearVelocity.y + direction.y * this.velocity;

        const x = direction.x ? direction.x * this.velocity : this._body.linearVelocity.x;
        const y = direction.y ? direction.y * this.velocity : this._body.linearVelocity.y;

        const velocity = cc.v2(x, y);
        this._body.linearVelocity = velocity;
    },

    onCharacterMoveEnd(direction) {
        // const x = this._body.linearVelocity.x - direction.x * this.velocity;
        // const y = this._body.linearVelocity.y - direction.y * this.velocity;

        const x = direction.x && (direction.x * this.velocity === this._body.linearVelocity.x) ? 0 : this._body.linearVelocity.x;
        const y = direction.y && (direction.y * this.velocity === this._body.linearVelocity.y) ? 0 : this._body.linearVelocity.y;

        const velocity = cc.v2(x, y);
        this._body.linearVelocity = velocity;
    },
});
