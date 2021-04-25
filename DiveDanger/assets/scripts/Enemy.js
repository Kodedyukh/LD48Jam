import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
        centerNode: { default: null, type: cc.Node },
        targetNodes: { default: [], type: cc.Node },
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
        _radius: { default: 500, serializable: false },
        _direction: { default: 1, serializable: false },

        _spinTimeout: { default: 0, serializable: false },
        _isAlive: { default: true, serializable: false },
        _isTriggered: { default: false, serializable: false },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._angle = this.startAngle;
        this._speed = this.startSpeed;

        cc.tween(this)
            .to(this.spinTimeout, { _radius: this.radius })
            .call(this._trigger.bind(this))
            .start();
    },

    update (dt) {
        if (this.centerNode) {
            this._angle = (this._angle + .0001 * this._speed * this._direction) % 360;
            const centerPos = this.centerNode.parent.convertToWorldSpaceAR(this.centerNode);

            const x = this._radius * Math.cos(this._angle / Math.PI * 180);
            const y = (this._radius * Math.sin(this._angle / Math.PI * 180)) / 1.5;
            this.node.setPosition(x, y);

            if (this._isTriggered) {
                this._spinTimeout += dt;
                if (this._spinTimeout > this.spinTimeout) {
                    this._spinTimeout = 0;
                    this._updateDirection();
                }
            }
        }
    },

    _trigger() {
        this._isTriggered = true;
        this._shoot();
    },

    _updateDirection() {
        if (Math.random() < this.spinChance) {
            this._direction *= -1;
        }

        const newRadius = Math.max(this.radius, this._radius + (Math.random() * 25 - 50));
        const newSpeed = Math.min(Math.max(this.startSpeed / 2, this._speed * (Math.random() * 2)), this.startSpeed * 3);

        cc.tween(this)
            .to(this.spinTimeout / 2, { _radius: newRadius, _speed: newSpeed })
            .start();
    },

    _shoot() {
        if (this._isAlive) {
            const startPos = this.node.convertToWorldSpaceAR(this.missileSpawner);

            cc.systemEvent.emit(GameEvent.GET_TARGET_ENGINES, (targetNodes) => {
                if (targetNodes.length) {
                    for (let target of targetNodes.sort(() => { return Math.random() > .5 ? 1 : -1 })) {
                        const endPos = target.parent.convertToWorldSpaceAR(target);
                        const results = cc.director.getPhysicsManager().rayCast(startPos, endPos, cc.RayCastType.All);

                        if (results.length && results[0].collider.node === target) {
                            this._createMissile(endPos.sub(startPos));
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
        const missile = cc.instantiate(this.missile);
        missile.parent = cc.director.getScene();
        missile.setPosition(this.node.convertToWorldSpaceAR(this.missileSpawner));
        missile.getComponent(cc.RigidBody).linearVelocity = velocity;
    }
});
