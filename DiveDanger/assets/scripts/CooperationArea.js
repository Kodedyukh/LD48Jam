import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
        cooperationEvent: { default: GameEvent.NONE, type: GameEvent },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    emitEvent () {
        cc.systemEvent.emit(this.cooperationEvent);
        cc.log(this.cooperationEvent);
    },

    // update (dt) {},
});
