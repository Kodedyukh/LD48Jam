import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
        topButton: '',
        downButton: '',
        leftButton: '',
        rightButton: '',
        useButton: ''
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    start () {

    },

    // update (dt) {},

    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY[this.topButton]:
                cc.systemEvent.emit(GameEvent.UP_BUTTON_PRESSED);
                break;
            case cc.macro.KEY[this.downButton]:
                cc.systemEvent.emit(GameEvent.DOWN_BUTTON_PRESSED);
                break;
            case cc.macro.KEY[this.leftButton]:
                cc.systemEvent.emit(GameEvent.LEFT_BUTTON_PRESSED);
                break;
            case cc.macro.KEY[this.rightButton]:
                cc.systemEvent.emit(GameEvent.RIGHT_BUTTON_PRESSED);
                break;
            case cc.macro.KEY[this.useButton]:
                cc.systemEvent.emit(GameEvent.USE_BUTTON_PRESSED);
                break;
        }
    },

    onKeyUp: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY[this.topButton]:
                cc.systemEvent.emit(GameEvent.UP_BUTTON_RELEASED);
                break;
            case cc.macro.KEY[this.downButton]:
                cc.systemEvent.emit(GameEvent.DOWN_BUTTON_RELEASED);
                break;
            case cc.macro.KEY[this.leftButton]:
                cc.systemEvent.emit(GameEvent.LEFT_BUTTON_RELEASED);
                break;
            case cc.macro.KEY[this.rightButton]:
                cc.systemEvent.emit(GameEvent.RIGHT_BUTTON_RELEASED);
                break;
            case cc.macro.KEY[this.useButton]:
                cc.systemEvent.emit(GameEvent.USE_BUTTON_RELEASED);
                break;
        }
    }
});
