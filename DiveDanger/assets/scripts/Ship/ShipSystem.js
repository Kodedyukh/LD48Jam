import GameEvent from 'GameEvent';

import EngineType from 'EngineType';
import ProducerAnimator from 'ProducerAnimator';

// helpers
const SystemParam = cc.Class({
	name: 'SystemParam',

	properties: {
		value: {
			default: 100
		},

		minValue: {
			default: 0
		},

		maxValue: {
			default: 100
		},

		// inflow and outflow applied every second

		inflow: {
			default: 0
		},

		outflow: {
			default: 0
		},

		//jump and drop are one time effects

		jump: {
			default: 0
		},

		drop: {
			default: 0
		},

		name: {
			default: ''
		}
	},

	setName(name) {
		this.name = name;
	},

	update(dt) {
		this.value = Math.min(this.maxValue, Math.max(this.minValue, 
			this.value + this.jump +
			this.inflow * dt - this.drop - this.outflow * dt));

		this.jump = 0;
		this.drop = 0;

		if (this.value <= this.minValue) {
			return false;
		}

		return true;
	}
});

const ParameterProducer = cc.Class({
	name: 'ParameterProducer',

	properties: {
		isActive: {
			default: true,
			notify() {
				if (this.isActive) {
					this.ship.launchProduction(this.param)
				} else {
					this.ship.stopProduction(this.param)
				}
			}
		},

		ship: {
			default: null
		},

		parameter: {
			default: null
		},

		maxTimeToBreak: {
			default: 10
		},

		producerAnimator: {
			default: null
		},

		totalRepairTime: {
			default: 3
		},

		_currentRepairTime: {
			default: 0
		}
	},

	init(ship, param, producerAnimator) {
		this.ship = ship;
		this.param = param;
		this.producerAnimator = producerAnimator;

		this.launchTimer();
	},

	setProducerAnimator(prodAnim) {
		this.producerAnimator = prodAnim;
		prodAnim.producer = this;
	},

	launchTimer() {
		const timeToBreak = Math.pow((Math.random() + Math.random() + Math.random() +
			Math.random() + Math.random() + Math.random()) / 6, 0.5) * 
			this.maxTimeToBreak;

		cc.log('time to break', timeToBreak);

		this.ship.postponeCall(() => {
			this.break();
		}, timeToBreak);
	},

	break() {
		this.isActive = false;
		this.producerAnimator.break();
	},

	repair(dt) {
		this._currentRepairTime += dt;

		if (this._currentRepairTime >= this.totalRepairTime) {
			this.fix();
		}
	},

	fix() {
		this.isActive = true;
		this.producerAnimator.fix();
		this._currentRepairTime = 0;

		this.launchTimer();
	}
})

//

cc.Class({
	extends: cc.Component,

	properties: {
		//visible
		oxygenConsumption: {
			default: 0
		},

		oxygenProduction: {
			default: 0
		},

		armsConsumption: {
			default: 0
		},

		armsProduction: {
			default: 0
		},

		shieldConsumption: {
			default: 0
		},

		shieldProduction: {
			default: 0
		},

		rollAngleSpeed: {
			default: 1
		},

		oxygenGeneratorNode: {
			default: null,
			type: cc.Node
		},

		armsGeneratorNode: {
			default: null,
			type: cc.Node
		},

		interactionAreas: {
			default: [],
			type: cc.Node
		},

		//public
		oxygen: {
			default: null,
			visible: false
		},

		arms: {
			default: null,
			visible: false
		},

		shield: {
			default: null,
			visible: false
		},

		rollAngle: {
			default: null,
			visible: false
		},

		oxygenProducer: {
			default: null,
			visible: false
		},

		armsProducer: {
			default: null,
			visible: false
		},

		//private
	},

	// LIFE-CYCLE CALLBACKS:

	onEnable() {
		this.oxygen = new SystemParam();
		this.arms = new SystemParam();
		this.shield = new SystemParam();
		this.rollAngle = new SystemParam();

		this.oxygen.setName('oxygen');
		this.arms.setName('arms');
		this.shield.setName('shield');
		this.rollAngle.setName('roll_angle');

		this.oxygen.inflow = this.oxygenProduction;
		this.oxygen.outflow = this.oxygenConsumption;

		this.arms.inflow = this.armsProduction;
		this.arms.outflow = 0;

		this.shield.inflow = 0;
		this.shield.outflow = 0;

		this.rollAngle.value = 0;
		this.rollAngle.minValue = -1000000;
		this.rollAngle.maxValue = 1000000;
		this.rollAngle.inflow = this.rollAngleSpeed;
		this.rollAngle.outflow = this.rollAngleSpeed;

		// set producers
		this.oxygenProducer = new ParameterProducer();
		this.oxygenProducer.init(this, this.oxygen, 
			this.oxygenGeneratorNode.getComponent(ProducerAnimator));

		this.armsProducer = new ParameterProducer();
		this.armsProducer.init(this, this.arms,
			this.armsGeneratorNode.getComponent(ProducerAnimator));

		this._handleSubscription(true);

	},

	onDisable() {
		this._handleSubscription(false);
	},

	update(dt) {
		if (!this.oxygen.update(dt)) {
			cc.systemEvent.emit(GameEvent.OUT_OF_OXYGEN);
		};

		if (!this.arms.update(dt)) {
			cc.systemEvent.emit(GameEvent.OUT_OF_ARMS);
		}

		if (!this.shield.update(dt)) {
			cc.systemEvent.emit(GameEvent.SHIELD_DESTROYED);
		}


		this.rollAngle.update(dt);
		this.node.angle = this.rollAngle.value;
		this.interactionAreas.forEach((area) => {
			area.angle = 0;
		}, this);

	},

	// public methods
	startProduction(param) {
		switch (param.name) {
			case 'oxygen':
				param.inflow = this.oxygenProduction;
				break;

			case 'arms':
				param.inflow = this.armsProduction;
				break;
		}
	},

	stopProduction(param) {
		param.inflow = 0;
	},

	postponeCall(call, time) {
		this.scheduleOnce(call, time);
	},

	// private methods
	_handleSubscription(isOn) {
		const func = isOn? 'on': 'off';

		cc.systemEvent[func](GameEvent.SHIELD_DAMAGED, this.onShieldDamaged, this);
		cc.systemEvent[func](GameEvent.SHOOT, this.onShoot, this);
		cc.systemEvent[func](GameEvent.ENGINE_BROKEN, this.onEngineBroken, this);
		cc.systemEvent[func](GameEvent.ENGINE_FIXED, this.onEngineFixed, this);
	},

	// callbacks

	onShieldDamaged() {
		this.shield.drop = this.shieldConsumption;
	},

	onShoot() {
		this.arms.drop = this.armsConsumption;
	},

	onEngineBroken(engineType) {
		cc.log('have engine broken');
		switch (engineType) {
			case EngineType.Left:
				cc.log('left is broken');
				this.rollAngle.inflow = 0;
				break;

			case EngineType.Right:
				this.rollAngle.outflow = 0;
				break;
		}
	},

	onEngineFixed(engineType) {
		switch (engineType) {
			case EngineType.Left:
				this.rollAngle.inflow = this.rollAngleSpeed;
				break;

			case EngineType.Right:
				this.rollAngle.outflow = this.rollAngleSpeed;
				break;
		}
	}
});