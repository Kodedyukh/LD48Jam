import GameEvent from 'GameEvent';

import Enemy from 'Enemy';

const WaveStructure = cc.Class({
	name: 'WaveStructure',

	properties: {

		depth: {
			default: 0
		},

		spawnNumber: {
			default: 0,
			type: cc.Integer
		},

		inQueue: {
			default: false
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

		_currentDepth: {
			default: 0,
			serilizable: false
		},

		_waveQueue: {
			default: [],
			serilizable: false
		},

		_lastDepth: {
			default: 1,
			serilizable: false
		},

		_isPaused: {
			default: false,
			serilizable: false
		}
	},

	// LIFE-CYCLE CALLBACKS:
	onEnable() {

		this._lastDepth = this.waves[this.waves.length - 1].depth;

		this._handleSubscription(true);
	},

	update(dt) {
		if (!this._isPaused) {
			const futureWaves = this.waves.filter(w => !w.inQueue);

			for (let i in futureWaves) {
				if (futureWaves[i].depth < this._currentDepth) {
					this._lunchWave(futureWaves[i]);
				}
			}

			cc.systemEvent.emit(GameEvent.TIME_TO_FINAL, 
				this._currentDepth / this._lastDepth);
		}
	},

	spawnEnemy() {
		const enemy = cc.instantiate(this.enemyPrefab);

		const angle = Math.PI * 2 * Math.random();
		const xPos = Math.cos(angle) * this.generationRadius;
		const yPos = Math.sin(angle) * this.generationRadius;
		

		enemy.getComponent(Enemy).centerNode = this.centerNode;
		enemy.getComponent(Enemy).startAngle = angle;
		enemy.getComponent(Enemy).radius = this.generationRadius;

		enemy.parent = this.node;

		enemy.setPosition(-1000, 1000);//xPos, yPos);

		this._currentNumberOfEnemies ++;
	},

	_handleSubscription(isOn) {
		const func = isOn? 'on': 'off';

		cc.systemEvent[func](GameEvent.ENEMY_DESTROYED, this.onEnemyDestroyed, this);
		cc.systemEvent[func](GameEvent.TOGGLE_PAUSE, this.onTogglePause, this);
		cc.systemEvent[func](GameEvent.CURRENT_DEPTH, this.onCurrentDepth, this);
	},

	_lunchWave(wave) {
		for (let i = 0; i < wave.spawnNumber; i++) {
			this.spawnEnemy();
		}
		wave.inQueue = true;

	},

	onEnemyDestroyed() {
		this._currentNumberOfEnemies --;

		if (this._currentNumberOfEnemies === 0) {
			const futureWaves = this.waves.filter(w => !w.inQueue);

			if (futureWaves.length === 0) {
				cc.log('last wave destroyed');
				cc.systemEvent.emit(GameEvent.LAST_WAVE_DESTROYED);
			}
		}
	},

	onTogglePause(isOn) {
		if (!this._isPaused && isOn) {
			this._isPaused = true;
		} else if (this._isPaused && !isOn) {
			this._isPaused = false;
		}
	},

	onCurrentDepth(depth) {
		//cc.log(depth);
		this._currentDepth = depth;
	}
});
