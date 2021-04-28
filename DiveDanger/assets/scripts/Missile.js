import GameEvent from 'GameEvent';
import Enemy from 'Enemy';

cc.Class({
    extends: cc.Component,

    properties: {
        explosionPrefab: { default: null, type: cc.Prefab }
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        this._body = this.getComponent(cc.RigidBody);
    },

    start () {

    },

    update(dt) {
        const angle = Math.atan2(this._body.linearVelocity.y,
            this._body.linearVelocity.x);

        this.node.angle = angle / Math.PI * 180 - 90;
    },

    _createExposion() {
        if (this.explosionPrefab) {
            const explosion = cc.instantiate(this.explosionPrefab);
            explosion.setPosition(this.node.parent.convertToWorldSpaceAR(this.node));
            explosion.parent = cc.director.getScene();
        }
    },

    onBeginContact(contact, self, other) {
        const otherGroupName = other.node.group;
        const selfGroupName = self.node.group;
        switch(otherGroupName){
            case 'cargo_borders': {
                if (selfGroupName === 'enemy_bullet') {
                    this._createExposion();
                    this.node.destroy();
                }
                
            } break;
            case 'engine': {
                if (selfGroupName === 'enemy_bullet') {
                    if (other.tag === 0) {
                        this._createExposion();
                        this.node.destroy();
                    }
                }
                
            } break;

            case 'enemy':
                cc.log('colision with enemy')
                if (selfGroupName === 'player_bullet') {
                    other.node.getComponent(Enemy).dead();
                    this.node.destroy();
                    cc.systemEvent.emit(GameEvent.ENEMY_DESTROYED); 
                }
        }
    }
});
