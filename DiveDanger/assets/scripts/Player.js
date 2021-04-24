import GameEvent from 'GameEvent';
import InteractionArea from 'InteractionArea';

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
		interactionMark: {
			default: null,
			type: cc.Node
		},

		inputs: { default() { return new PlayerInputsHelper() }, type: PlayerInputsHelper, visible: false },

		_body: { default: null, serializable: false },
		_interactionArea: { default: null, serializable: false },
		_isJumping: { default: false, serializable: false },
		_useDuration: { default: 0, serializable: false }
	},

	// LIFE-CYCLE CALLBACKS:

	onLoad () {
		this._body = this.getComponent(cc.RigidBody);
		this._handleSubscription(true); 
	},

	start () {
		this.interactionMark.opacity = 0;
	},

	update (dt) {
		const velocity = cc.v2(0, this._body.linearVelocity.y);
		if (this.inputs.left) velocity.x -= this.runVelocity;
		if (this.inputs.right) velocity.x += this.runVelocity;
		if (this.inputs.top && !this._isJumping) {
			this._isJumping = true;
			velocity.y += this.jumpVelocity;
		}

		/*if (this.inputs.use) {
			this._useDuration += dt;
			if (this._useDuration > this.useDuration) {
				this.inputs.use = false;
			   
			}
		} else {
			this._useDuration = 0;
		}*/

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

		if (this._interactionArea) {
			this._interactionArea.startInteraction();
		}
	},
	onUseButtonReleased() {
		this.inputs.use = false;

		if (this._interactionArea) {
			this._interactionArea.stopInteraction();
		}
	},

	onBeginContact(contact, self, other) {
		const otherGroupName = other.node.group;
		switch(otherGroupName){
			case 'cargo_borders': {
				if (contact.getManifold().points.length === 0)
					this._isJumping = false;
			} break;
			case 'interaction_area': {
				cc.log('begin contact with interaction area');
				if (self.tag === 1) {
					cc.log('enter interaction area');
					this._interactionArea = other.node.getComponent(InteractionArea);

					if (this._interactionArea) {
						this.interactionMark.opacity = 255;
					}
				}
				
			} break;
		}
	},

	onEndContact(contact, self, other) {
		const otherGroupName = other.node.group;
		switch(otherGroupName){
			case 'interaction_area': {
				if (self.tag === 1) {
					cc.log('leave interaction area');
					if (this._interactionArea) {
						this._interactionArea.stopInteraction();
					}

					if (this.interactionMark.opacity > 0) {
						this.interactionMark.opacity = 0;
					}

					this._interactionArea = null;
				}
			} break;
		}
	}
});
