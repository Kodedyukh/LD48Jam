import GameEvent from 'GameEvent';

import InteractionArea from 'InteractionArea';

cc.Class({
    extends: InteractionArea,

    properties: {
        // visible
        toggleEvent: {
            default: GameEvent.NONE,
            type: GameEvent
        },

        togglerName: {
            default: ''
        },

        addArgs: {
            default: [],
            type: cc.String
        },

        initiallyOn: {
            default: true
        },
        // public

        // private
        _isOn: {
            default: true
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        this._isOn = this.initiallyOn;
        this.scheduleOnce(() => {
            this.startInteractionCall = () => {
                this._isOn = !this._isOn;
                cc.systemEvent.emit(this.toggleEvent, this._isOn, ...this.addArgs);

                const animationName = this.togglerName + '_' + 
                    (this._isOn?'on': 'off');

                cc.log(animationName);

                this._animation && this._animation.play(animationName);
            };

            this.endInteractionCall = null;
        });

        this._animation = this.getComponent(cc.Animation);
    },



    // update (dt) {},
});
