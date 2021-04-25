import GameEvent from 'GameEvent'

cc.Class({
    extends: cc.Component,

    properties: {
        muzzleNode: { default: null, type: cc.Node },
        missile: { default: null, type: cc.Prefab },

        shootDelay: 1,

        _angle: { default: 0, serializable: false },
        _isActive: { default: true, serializable: false },
        _isAiming: { default: false, serializable: false },

        _startAngle: { default: 0, serializable: false },
        _muzzleAngle: { default: 0, serializable: false },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._handleSubscription(true);
    },

    start () {

    },

    // update (dt) {},

    activate(state) {
        this._isActive = state;
    },

	_handleSubscription(isOn) {
		const func = isOn ? 'on' : 'off';

		cc.systemEvent[func](GameEvent.MOUSE_DOWN, this.onMouseDown, this);
		cc.systemEvent[func](GameEvent.MOUSE_MOVE, this.onMouseMove, this);
		cc.systemEvent[func](GameEvent.MOUSE_UP, this.onMouseUp, this);
	},

    _getAngleFromPosition(worldPosition) {
        const hypot = Math.hypot(worldPosition.x, worldPosition.y);
        const v1 = cc.v2(hypot, 0);
        const v2 = this.node.parent.convertToWorldSpaceAR(this.node).sub(worldPosition);
        return (v2.y <= 0 ? 1 : -1) * Math.acos((v1.x * v2.x + v1.y * v2.y) / (Math.hypot(v1.x,v1.y) * Math.hypot(v2.x, v2.y))) * 180 / Math.PI;
    },

    _shoot() {
        if (this._isActive) {
            this._createMissile();
        }
    },

    _createMissile() {
        const missile = cc.instantiate(this.missile);
        missile.parent = cc.director.getScene();

        const muzzlePosition = this.node.convertToWorldSpaceAR(this.muzzleNode);
        const muzzleWidth = this.muzzleNode.width;
        const muzzleAngle = this.muzzleNode.angle / 180 * Math.PI;
        const muzzleOffset = cc.v2(muzzleWidth * Math.cos(muzzleAngle), muzzleWidth * Math.sin(muzzleAngle));
        const firePosition = muzzlePosition.sub(muzzleOffset);

        missile.setPosition(firePosition);
        missile.getComponent(cc.RigidBody).linearVelocity = muzzleOffset.mul(-1);
    },

    onMouseDown(worldPosition) {
        if (this._isActive) {
            this._isAiming = true;
            this._muzzleAngle = this.muzzleNode.angle;

            this._startAngle = this._getAngleFromPosition(worldPosition);
        }
    },

    onMouseMove(worldPosition) {
        if (this._isActive && this._isAiming) {
            const angle = this._getAngleFromPosition(worldPosition);
            this.muzzleNode.angle = this._muzzleAngle + (this._startAngle - angle);
        }
    },

    onMouseUp() {
        this._isAiming = false;
        this._shoot();
    }
});