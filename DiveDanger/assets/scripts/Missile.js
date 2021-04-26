import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onBeginContact(contact, self, other) {
        const otherGroupName = other.node.group;
        const selfGroupName = self.node.group;
        switch(otherGroupName){
            case 'cargo_borders': {
                if (selfGroupName === 'enemy_bullet') {
                    this.node.destroy();
                }
                
            } break;
            case 'engine': {
                if (selfGroupName === 'enemy_bullet') {
                    if (other.tag === 0) {
                        this.node.destroy();
                    }
                }
                
            } break;

            case 'enemy':
                cc.log('colision with enemy')
                if (selfGroupName === 'player_bullet') {
                    other.node.destroy();
                    this.node.destroy();
                    cc.systemEvent.emit(GameEvent.ENEMY_DESTROYED); 
                }
        }
    }
});
