import GameEvent from 'GameEvent';
import SoundName from 'SoundName';

const EnemyAnimations = cc.Enum({
    Idle: 'monster_idle',
    Death: 'monster_death'
});

cc.Class({
    extends: cc.Component,

    properties: {
        centerNode: { default: null, type: cc.Node },
        radius: 300,

        startSpeed: 1,
        startAngle: 0,

        spinTimeout: 5,
        spinChance: .35,

        shootDelay: 1,

        missile: { default: null, type: cc.Prefab },
        missileSpawner: { default: null, type: cc.Node },

        _angle: { default: 0, serializable: false },
        _speed: { default: 1, serializable: false },
        _radius: { default: 900, serializable: false },
        _direction: { default: 1, serializable: false },

        _spinTimeout: { default: 0, serializable: false },
        _isAlive: { default: true, serializable: false, notify(old) {
            if (!this._isAlive) {
                this._animation.play(EnemyAnimations.Death);
            }
        } },
        _isTriggered: { default: false, serializable: false },
        _isPaused: {default: false, serializable: false},
        _animation: {default: null, serializable: false}
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable () {
        cc.log('enemy on enable', this.radius);
        this._angle = this.startAngle;
        this._speed = this.startSpeed;
        //this._radius = this.node.convertToWorldSpaceAR(cc.v2()).mag();

        //cc.log(this._radius);

        cc.tween(this)
            .to(this.spinTimeout, { _radius: this.radius })
            .call(this._trigger.bind(this))
            .start();

        this._animation = this.getComponent(cc.Animation);

        this._handleSubscription(true);
    },

    update (dt) {
        if (!this._isPaused) {
            if (this.centerNode) {
                this._angle = (this._angle + .004 * this._speed * this._direction) % 360;
                const centerPos = this.centerNode.parent.convertToWorldSpaceAR(this.centerNode);

                const x = this._radius * Math.cos(this._angle);
                const y = this._radius * Math.sin(this._angle);
                this.node.setPosition(x, y);

                if (this._isTriggered) {
                    this._spinTimeout += dt;
                    if (this._spinTimeout > this.spinTimeout) {
                        this._spinTimeout = 0;
                        this._updateDirection();
                    }
                }
            }
        }
        
    },

    dead() {
        if (this._isAlive) {
            this._isAlive = false;
        }
    },

    suicide() {
        this.node.destroy();
    },

    _handleSubscription(isOn) {
        const func = isOn? 'on': 'off';

        cc.systemEvent[func](GameEvent.TOGGLE_PAUSE, this.onTogglePause, this);
    },

    _trigger() {
        this._isTriggered = true;
        this._shoot();
    },

    _updateDirection() {
        cc.log('update direction called');
        if (Math.random() < this.spinChance) {
            this._direction *= -1;
        }

        const newRadius = Math.max(this.radius, this._radius + (Math.random() * 25 - 50));
        const newSpeed = Math.min(Math.max(this.startSpeed / 2, this._speed * 
            (Math.random() * 2)), this.startSpeed * 2);

        cc.tween(this)
            .to(this.spinTimeout / 2, { _radius: newRadius, _speed: newSpeed })
            .start();
    },

    _shoot() {
        //cc.log('calling shoot')
        if (this._isAlive) {
            const startPos = this.node.convertToWorldSpaceAR(this.missileSpawner);

            cc.systemEvent.emit(GameEvent.GET_TARGETS, (targetNodes) => {
                if (targetNodes.length) {
                    //cc.log('choosing node', targetNodes);
                    for (let target of targetNodes.sort(() => { return Math.random() > .5 ? 1 : -1 })) {
                        const endPos = target.convertToWorldSpaceAR(cc.v2());
                        const results = cc.director.getPhysicsManager().rayCast(startPos, endPos, cc.RayCastType.Closest);

                        //cc.log('results', results);
                        if (results.length && results[0].collider.node === target) {
                            this._createMissile(endPos.sub(startPos));
                            cc.systemEvent.emit(GameEvent.SOUND_ACTIVE, SoundName.EnemyShot);
                            break;
                        }
                    }
                } else {
                    const endPos = this.centerNode.parent.convertToWorldSpaceAR(this.centerNode);
                    this._createMissile(endPos.sub(startPos));
                }
            });

            this.scheduleOnce(() => {
                this._shoot();
            }, this.shootDelay);

        }
    },

    _createMissile(velocity) {
        //cc.log('create missile');
        const missile = cc.instantiate(this.missile);
        missile.parent = cc.director.getScene();
        missile.setPosition(this.node.convertToWorldSpaceAR(this.missileSpawner));
        missile.getComponent(cc.RigidBody).linearVelocity = velocity;
    },

    onTogglePause(isOn) {
        if (!this._isPaused && isOn) {
            this._isPaused = true;
        } else if (this._isPaused && !isOn) {
            this._isPaused = false;
        }
    }
});
