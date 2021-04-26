import GameEvent from 'GameEvent';

import Enemy from 'Enemy';

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
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onEnable() {
        this.scheduleOnce(() => {
            this.spawnEnemy();
        }, 1);

        this._handleSubscription(true);
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
    },

    _handleSubscription(isOn) {
        const func = isOn? 'on': 'off';

        cc.systemEvent[func](GameEvent.ENEMY_DESTROYED, this.onEnemyDestroyed, this);
    },

    onEnemyDestroyed() {
        this.scheduleOnce(() => {
            this.spawnEnemy();
        }, 1);
    }
});
