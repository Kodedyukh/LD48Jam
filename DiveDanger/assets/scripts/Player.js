import GameEvent from 'GameEvent';
import InteractionArea from 'InteractionArea';
import SoundName from 'SoundName';

const PlayerInputsHelper = cc.Class({
	name: 'PlayerInputsHelper',
	properties: {
		left: false,
		right: false,
		top: false,
		use: false
	},
});

const PlayerAnimations = cc.Enum({
    Idle: 'player_idle',
    Run: 'player_run',
    Jump: 'player_jump',
    Repair: 'player_repair'
})

cc.Class({
	extends: cc.Component,

	properties: {
		runVelocity: 100,
		jumpVelocity: 100,
		jumpCoolDown: 2,
		useDuration: 3,
		interactionMark: {
			default: null,
			type: cc.Node
		},


		inputs: { default() { return new PlayerInputsHelper() }, type: PlayerInputsHelper, visible: false },

		_body: { default: null, serializable: false },
		_interactionAreas: { default: [], serializable: false },
		_isJumping: { default: false, serializable: false },
		_useDuration: { default: 0, serializable: false },
		_isPinned: {default: false, serializable: false},
		_jumpTimeout: { default: 0, serializable: false },
		_isPaused: {default: false, serializable: false},

		_animation: { default: null, serializable: false },
        _currentAnimation: { default: null, serializable: false },

		_isSleepingPlayer: { default: false, serializable: false}
	},

	// LIFE-CYCLE CALLBACKS:

	onLoad () {
		this._body = this.getComponent(cc.RigidBody);
		this._animation = this.getComponent(cc.Animation);
		this._handleSubscription(true); 
	},

	start () {
		this.interactionMark.opacity = 0;
	},

	update (dt) {
		if (!this._isPaused) {
			const velocity = cc.v2(0, this._body.linearVelocity.y);
			if (this.inputs.left) velocity.x -= this.runVelocity;
			if (this.inputs.right) velocity.x += this.runVelocity * (this._isJumping ? 1.5 : 1);
			if (this.inputs.top && !this._isJumping && this._jumpTimeout >= this.jumpCoolDown) {
				this._isJumping = true;
				this._jumpTimeout = 0;
				velocity.y += this.jumpVelocity;
				cc.systemEvent.emit(GameEvent.SOUND_ACTIVE, SoundName.PlayerJump);
			}

			if (this._jumpTimeout < this.jumpCoolDown) {
				this._jumpTimeout += dt;
			}

			this._body.linearVelocity = velocity;
            this._setAnimation();
		}
		
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

		cc.systemEvent[func](GameEvent.ROPE_TOGGLE, this.onRopeToggle, this);
		cc.systemEvent[func](GameEvent.TURRET_ENTER, this.onTurretEnter, this);

		cc.systemEvent[func](GameEvent.TOGGLE_PAUSE, this.onTogglePause, this);
	},

    _setAnimation() {
        let animation = PlayerAnimations.Idle;

        if (this._isJumping) {
            animation = PlayerAnimations.Jump;
        } else {
            if (this.inputs.left) {
                animation = PlayerAnimations.Run;
                this.node.scaleX = -1;
            } else if (this.inputs.right) {
                animation = PlayerAnimations.Run;
                this.node.scaleX = 1;
            } else if (this.inputs.use && this._interactionAreas.length && this._interactionAreas[0].repairable) {
                animation = PlayerAnimations.Repair;
            }
        }

        if (this._currentAnimation !== animation) {
            this._currentAnimation = animation;
            this._animation.play(animation);
        }
    },

	onLeftButtonPressed() {
		if (!this._isPinned){
			this.inputs.left = true;

		}
		
	},
	onLeftButtonReleased() {
		if (!this._isPinned){
			this.inputs.left = false;
		}
	},
	onRightButtonPressed() {
		if (!this._isPinned){
			this.inputs.right = true;
		}
	},
	onRightButtonReleased() {
		if (!this._isPinned){
			this.inputs.right = false;
		}
	},
	onUpButtonPressed() {
		if (!this._isPinned){
			this.inputs.top = true;
		}
	},
	onUpButtonReleased() {
		if (!this._isPinned){
			this.inputs.top = false;
		}
	},

	onUseButtonPressed() {
		if (!this._isSleepingPlayer){
			this.inputs.use = true;

			if (this._interactionAreas.length) {
				this._interactionAreas[0].startInteraction();
			}
		}
	},
	onUseButtonReleased() {
		if (!this._isSleepingPlayer){
			this.inputs.use = false;

			if (this._interactionAreas.length) {
				this._interactionAreas[0].stopInteraction();
			}
		}
	},

	onRopeToggle(isOn) {
		if (!this._isPinned && isOn) {
			this.inputs.left = false;
			this.inputs.right = false;
			this.inputs.top = false;

			this._isSleepingPlayer = true;
			this._isPinned = true;
			cc.systemEvent.emit(GameEvent.PIN_PLAYER, true);
			cc.systemEvent.emit(GameEvent.ENGINES_STOP);

			cc.tween(this.node)
				.to(0.3, {opacity: 0})
				.start();
		} else if (this._isPinned && !isOn) {
			this._isPinned = false;
			this._isSleepingPlayer = false;
			//cc.log('emitting uooin');
			cc.systemEvent.emit(GameEvent.PIN_PLAYER, false);
			cc.tween(this.node)
				.to(0.3, {opacity: 255})
				.start();
		}
	},

	onTurretEnter(isOn) {
		if (!this._isPinned && isOn) {
			this.inputs.left = false;
			this.inputs.right = false;
			this.inputs.top = false;
			
			this._isPinned = true;
			cc.systemEvent.emit(GameEvent.PIN_PLAYER, true);
			cc.tween(this.node)
				.to(0.3, {opacity: 0})
				.start();
		} else if (this._isPinned && !isOn) {
			this._isPinned = false;
			//cc.log('emitting uooin');
			cc.systemEvent.emit(GameEvent.PIN_PLAYER, false);
			cc.tween(this.node)
				.to(0.3, {opacity: 255})
				.start();
		}
	},

	onTogglePause(isOn) {
		if (!this._isPaused && isOn) {
			this._isPaused = true;
			cc.systemEvent.emit(GameEvent.PIN_PLAYER, true);
		} else if (this._isPaused && !isOn) {
			this._isPaused = false;
			cc.systemEvent.emit(GameEvent.PIN_PLAYER, false);
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
				//cc.log('begin contact with interaction area');
				if (self.tag === 1) {

					//cc.log('enter interaction area');
					const interactionArea = other.node.getComponent(InteractionArea);
					if (interactionArea) {
						this._interactionAreas.push(interactionArea);
					}

					if (this._interactionAreas.length) {
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
					const interactionArea = other.node.getComponent(InteractionArea);
					if (interactionArea) {
						interactionArea.stopInteraction();
					}

					this._interactionAreas = this._interactionAreas.filter(a => a !== interactionArea);

					if (this._interactionAreas.length === 0) {
						this.interactionMark.opacity = 0;
					}
				}
			} break;
		}
	}
});
