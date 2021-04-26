import GameEvent from 'GameEvent';

import Enemy from 'Enemy';

const WaveStructure = cc.Class({
	name: 'WaveStructure',

	properties: {

		delay: {
			default: 1
		},

		spawnNumbers: {
			default: [],
			type: cc.Integer
		}
	}
})

cc.Class({
	extends: cc.Component,

	properties: {
		centerNode: {
			default: null,
			type: cc.Node
		},

		enemyPrefab: {
			default: null,
			type: cc.Prefab
		},

		generationRadius: {
			default: 800
		},

		waves: {
			default: [],
			type: WaveStructure
		},

		_currentNumberOfEnemies: {
			default: 0,
			serilizable: false
		},

		_currentWaveNumber: {
			default: 0,
			serilizable: false
		},

		_currentAttackNumber: {
			default: 0,
			serilizable: false
		},

		_waitingNextWave: {
			default: false,
			serilizable: false
		},

		_timeLeft: {
			default: 0,
			serilizable: false
		},

		_currentDelay: {
			default: 0,
			serilizable: false
		},

		_isPaused: {
			default: false,
			serilizable: false
		}
	},

	// LIFE-CYCLE CALLBACKS:
	onEnable() {
		this._currentDelay = this.waves[0].delay;
		this._timeLeft = this._currentDelay;
		this._waitingNextWave = true;

		this._handleSubscription(true);
	},

	update(dt) {
		if (!this._isPaused) {
			if (this._waitingNextWave) {
				this._timeLeft -= dt;

				if (this._timeLeft <= 0) {
					this._launchAttack();
					this._waitingNextWave = false;
				} else {
					cc.systemEvent.emit(GameEvent.TIME_TO_WAVE, 
						this._timeLeft / this._currentDelay);
				}
			}
		}
	},

	spawnEnemy() {
		const enemy = cc.instantiate(this.enemyPrefab);

		const angle = Math.PI * 2 * Math.random();
		const xPos = Math.cos(angle) * this.generationRadius;
		const yPos = Math.sin(angle) * this.generationRadius;
		

		enemy.getComponent(Enemy).centerNode = this.centerNode;
		enemy.getComponent(Enemy).startAngle = angle;

		enemy.parent = this.node;

		enemy.setPosition(xPos, yPos);

		this._currentNumberOfEnemies ++;
	},

	_handleSubscription(isOn) {
		const func = isOn? 'on': 'off';

		cc.systemEvent[func](GameEvent.ENEMY_DESTROYED, this.onEnemyDestroyed, this);
		cc.systemEvent[func](GameEvent.TOGGLE_PAUSE, this.onTogglePause, this);
	},

	_launchAttack() {
		const wave = this.waves[this._currentWaveNumber];

		if (this._currentAttackNumber < wave.spawnNumbers.length) {
			const spawnNumber = wave.spawnNumbers[this._currentAttackNumber];

			for (let i = 0; i < spawnNumber; i++) {
				this.spawnEnemy();
			}
		} else {
			this._currentAttackNumber = 0;
			this._currentWaveNumber ++;

			if (this._currentWaveNumber < this.waves.length) {
				this._currentDelay = this.waves[this._currentWaveNumber].delay;
				this._timeLeft = this._currentDelay;
				this._waitingNextWave = true;
			} else {
				cc.systemEvent.emit(GameEvent.LAST_WAVE_DESTROYED);
			}

			

		}
	},

	onEnemyDestroyed() {
		this._currentNumberOfEnemies --;

		if (this._currentNumberOfEnemies === 0) {
			this._currentAttackNumber ++;
			this._launchAttack();
		}
	},

	onTogglePause(isOn) {
		if (!this._isPaused && isOn) {
			this._isPaused = true;
		} else if (this._isPaused && !isOn) {
			this._isPaused = false;
		}
	}
});
