import GameEvent from 'GameEvent';
import RopeType from 'RopeType';

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad(){
        this.scheduleOnce(()=>{
            cc.systemEvent.emit(GameEvent.ROPE_TOGGLE, RopeType.Top, true);
        }, 2)

        this.scheduleOnce(()=>{
            cc.systemEvent.emit(GameEvent.ROPE_TOGGLE, RopeType.Top, false);
        }, 6)

        this.scheduleOnce(()=>{
            cc.systemEvent.emit(GameEvent.ROPE_TOGGLE, RopeType.Bottom, true);
        }, 10)

    },

    // start () {

    // },

    // update (dt) {},
});
