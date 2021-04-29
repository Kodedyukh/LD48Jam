import GameEvent from 'GameEvent';
import SoundName from 'SoundName';
import Toggler from 'Toggler';

cc.Class({
    extends: Toggler,

    properties: {
        // visible
        conditionEvent: {
            default: GameEvent.NONE,
            type: GameEvent
        },
        // publice

        // private
        _condition: {
            default: true
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable() {
        this._isOn = this.initiallyOn;
        
        this.scheduleOnce(() => {
            this.startInteractionCall = () => {
                cc.log('calling');
                // if (this._condition) {
                    this._isOn = !this._isOn;
                    cc.log(...this.addArgs);
                    cc.systemEvent.emit(this.toggleEvent, this._isOn, ...this.addArgs);

                    const animationName = this.togglerName + '_' + 
                        (this._isOn?'on': 'off');

                    this._animation && this._animation.play(animationName);
                    cc.systemEvent.emit(GameEvent.SOUND_ACTIVE, SoundName.PlayerInWater);
                // }
                
            };

            this.endInteractionCall = null;
        });

        this._animation = this.getComponent(cc.Animation);

        this._handleSubscription(true);
    },

    onDisable() {
        this._handleSubscription(false);
    },

    // privare methods

    _handleSubscription(isOn) {
        const func = isOn? 'on': 'off';

        cc.systemEvent[func](this.conditionEvent, this.onConditionEvent, this);
    },

    // callbacks
    onConditionEvent(isOn) {
        if (this._condition && !isOn) {
            this._condition = false;
            cc.log('condition false');
        } else if (!this._condition && isOn) {
            this._condition = true;
            cc.log('condition true');
        }
    }
});
