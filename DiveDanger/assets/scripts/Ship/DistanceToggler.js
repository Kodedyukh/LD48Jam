import GameEvent from 'GameEvent';

import Toggler from 'Toggler';

cc.Class({
    extends: Toggler,

    properties: {
        turnOffEvent: {
            default: GameEvent.NONE,
            type: GameEvent
        },

        brokeEvent: {
            default: GameEvent.NONE,
            type: GameEvent
        },

        fixEvent: {
            default: GameEvent.NONE,
            type: GameEvent
        },

        _isBroken: {
            default: false,
            serializable: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        this._isOn = this.initiallyOn;
        this.scheduleOnce(() => {
            this.startInteractionCall = () => {
                //cc.log('start interaction call', this._isBroken || this._isOn);
                if (!this._isBroken || this._isOn) {
                    this._isOn = !this._isOn;
                    cc.systemEvent.emit(this.toggleEvent, this._isOn, ...this.addArgs);
                }
                
            };

            this.endInteractionCall = null;
        });

        this._animation = this.getComponent(cc.Animation);

        this._handleSubscription(true);
    },

    _handleSubscription(isOn) {
        const func = isOn? 'on': 'off';

        if (this.turnOffEvent !== GameEvent.NONE) {
            cc.systemEvent[func](this.turnOffEvent, this.onTurnOffEvent, this);
        }

        if (this.brokeEvent !== GameEvent.NONE) {
            cc.systemEvent[func](this.brokeEvent, this.onBrokenEvent, this);
        }

        if (this.fixEvent !== GameEvent.NONE) {
            cc.systemEvent[func](this.fixEvent, this.onFixEvent, this);
        }
    },

    onTurnOffEvent() {
        //cc.log('have turn off event');
        if (this._isOn) {
            this.startInteraction();
        }
    },

    onBrokenEvent(engineType) {
        //cc.log('have broken event', engineType);
        if (!this._isBroken && Number(this.addArgs[0]) === engineType) {

            this._isBroken = true;

            if (this._isOn) {
                //cc.log('startting interaction')
                this.startInteraction();
            }

            const animationName = this.togglerName + '_' + 
            (this._isBroken ? 'off': 'on');
            this._animation && this._animation.play(animationName);
        }
    },

    onFixEvent(engineType) {
        if (this._isBroken && Number(this.addArgs[0]) === engineType) {
            this._isBroken = false;

            const animationName = this.togglerName + '_' + 
            (this._isBroken ? 'off': 'on');
            this._animation && this._animation.play(animationName);
        }
    }

    // update (dt) {},
});
