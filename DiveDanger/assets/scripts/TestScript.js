import GameEvent from 'GameEvent';

import EngineType from 'EngineType';

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.scheduleOnce(() => {
            cc.systemEvent.emit(GameEvent.ENGINE_BROKEN, EngineType.Left);
        }, 3)
    },

    // update (dt) {},
});
