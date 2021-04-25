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
        otherGroupName = other.node.group;
        switch(otherGroupName){
            case 'cargo_borders': {
                cc.log('cargo damage');
                this.node.destroy();
            } break;
            case 'engines': {
                cc.systemEvent.emit(GameEvent.ENGINE_DAMAGED, other.node);
                this.node.destroy();
            } break;
        }
    }
});
