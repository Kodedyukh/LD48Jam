import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
        startScreen: {
            default: null,
            type: cc.Prefab
        },

        winnerScreen: {
            default: null,
            type: cc.Prefab
        },

        outOxyScreen: {
            default: null,
            type: cc.Prefab
        },

        outShieldScreen: {
            default: null,
            type: cc.Prefab
        },

        _startScreenNode: {
            default: null,
            serializable: false
        },

        _winnerScreenNode: {
            default: null,
            serializable: false
        },

        _outOxyScreenNode: {
            default: null,
            serializable: false
        },

        _outShieldScreenNode: {
            default: null,
            serializable: false
        }
    },

    onEnable() {
        this._handlerSubscribe(true);

        this._startScreenNode = cc.instantiate(this.startScreen);
        this._winnerScreenNode = cc.instantiate(this.winnerScreen);
        this._outOxyScreenNode = cc.instantiate(this.outOxyScreen);
        this._outShieldScreenNode = cc.instantiate(this.outShieldScreen);

        this._startScreenNode.parent = this.node;
        
        cc.systemEvent.on(GameEvent.USE_BUTTON_PRESSED, this.onStartEvent, this);
        cc.systemEvent.emit(GameEvent.TOGGLE_PAUSE, true);

    },

    onDisable() {
        this._handlerSubscribe(true);    
    },

    _handlerSubscribe(isOn) {
		const func = isOn ? 'on' : 'off';

		cc.systemEvent[func](GameEvent.OUT_OF_OXYGEN, this.onOutOxyScreen, this);
		cc.systemEvent[func](GameEvent.SHIELD_DESTROYED, this.onOutSchieldScreen, this);
		cc.systemEvent[func](GameEvent.LAST_WAVE_DESTROYED, this.onWinnerScreen, this);

	},

    onOutOxyScreen() {
        this._outOxyScreenNode.parent = this.node;

        cc.systemEvent.on(GameEvent.USE_BUTTON_PRESSED, this.onRestartEvent, this);
        cc.systemEvent.emit(GameEvent.TOGGLE_PAUSE, true);
    },

    onOutSchieldScreen() {
        this._outShieldScreenNode.parent = this.node;

        cc.systemEvent.on(GameEvent.USE_BUTTON_PRESSED, this.onRestartEvent, this);
        cc.systemEvent.emit(GameEvent.TOGGLE_PAUSE, true);
    },

    onWinnerScreen() {
        this._winnerScreenNode = this.node;

        cc.systemEvent.on(GameEvent.USE_BUTTON_PRESSED, this.onRestartEvent, this);
        cc.systemEvent.emit(GameEvent.TOGGLE_PAUSE, true);
    },

    onStartEvent() {
        this._startScreenNode.parent = null;
        cc.systemEvent.off(GameEvent.USE_BUTTON_PRESSED, this.onStartEvent, this);
        cc.systemEvent.emit(GameEvent.TOGGLE_PAUSE, false);
    },

    onRestartEvent() {
        this._startScreenNode.parent = null;
        this._winnerScreenNode.parent = null;
        this._outOxyScreenNode.parent = null;
        this._outShieldScreenNode.parent = null;

        cc.systemEvent.off(GameEvent.USE_BUTTON_PRESSED, this.onRestartEvent, this);
        
        //Restart Code
        cc.director.loadScene('Screens');
    }

});
