import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
        topButton: '',
        downButton: '',
        leftButton: '',
        rightButton: '',
        useButton: '',

        _isPressTopButton: {
            default: false,
            serializable: false
        },

        _isPressRightButton: {
            default: false,
            serializable: false
        },

        _isPressDownButton: {
            default: false,
            serializable: false
        },

        _isPressLeftButton: {
            default: false,
            serializable: false
        },
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

                if (!this._isPressTopButton) {
                    cc.systemEvent.emit(GameEvent.CHARACTER_MOVE_START, cc.v2(0, 1));
                    this._isPressTopButton = true;
                }
                break;

            case cc.macro.KEY[this.downButton]:
                cc.systemEvent.emit(GameEvent.DOWN_BUTTON_PRESSED);
                
                if (!this._isPressDownButton) {
                    cc.systemEvent.emit(GameEvent.CHARACTER_MOVE_START, cc.v2(0, -1));
                    this._isPressDownButton = true;
                }
                break;

            case cc.macro.KEY[this.leftButton]:
                cc.systemEvent.emit(GameEvent.LEFT_BUTTON_PRESSED);

                if (!this._isPressLeftButton) {
                    cc.systemEvent.emit(GameEvent.CHARACTER_MOVE_START, cc.v2(-1, 0));
                    this._isPressLeftButton = true;
                }
                break;

            case cc.macro.KEY[this.rightButton]:
                cc.systemEvent.emit(GameEvent.RIGHT_BUTTON_PRESSED);

                if (!this._isPressRightButton) {
                    cc.systemEvent.emit(GameEvent.CHARACTER_MOVE_START, cc.v2(1, 0));
                    this._isPressRightButton = true;
                }
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
                
                if (this._isPressTopButton) {
                    cc.systemEvent.emit(GameEvent.CHARACTER_MOVE_START, cc.v2(0, 1));
                    this._isPressTopButton = false;
                }
                break;

            case cc.macro.KEY[this.downButton]:
                cc.systemEvent.emit(GameEvent.DOWN_BUTTON_RELEASED);

                if (this._isPressDownButton) {
                    cc.systemEvent.emit(GameEvent.CHARACTER_MOVE_START, cc.v2(0, -1));
                    this._isPressDownButton = false;
                }
                break;

            case cc.macro.KEY[this.leftButton]:
                cc.systemEvent.emit(GameEvent.LEFT_BUTTON_RELEASED);
                
                if (this._isPressLeftButton) {
                    cc.systemEvent.emit(GameEvent.CHARACTER_MOVE_START, cc.v2(-1, 0));
                    this._isPressLeftButton = false;
                }
                break;

            case cc.macro.KEY[this.rightButton]:
                cc.systemEvent.emit(GameEvent.RIGHT_BUTTON_RELEASED);

                if (this._isPressRightButton) {
                    cc.systemEvent.emit(GameEvent.CHARACTER_MOVE_START, cc.v2(1, 0));
                    this._isPressRightButton = false;
                }
                break;

            case cc.macro.KEY[this.useButton]:
                cc.systemEvent.emit(GameEvent.USE_BUTTON_RELEASED);
                break;
        }
    }
});
