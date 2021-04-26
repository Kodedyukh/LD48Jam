import GameEvent from 'GameEvent';
import SoundName from 'SoundName';

const Sound = cc.Class({
    name: 'Sound',

    properties: {
        name: {
            default: SoundName.Default,
            type: SoundName
        },

        clip: {
            default: null,
            type: cc.AudioClip
        }
    }
})

cc.Class({
    extends: cc.Component,

    properties: {
        sounds: {
            default: [],
            type: Sound 
        },

        audioSource: {
            default: null,
            type: cc.AudioSource
        }
    },

    onLoad() {
        this._handlerSubscribe(true);    
    },

    _handlerSubscribe(isOn) {
        const func = isOn ? 'on' : 'off';

        cc.systemEvent[func](GameEvent.SOUND_ACTIVE, this.onSoundActive, this);
    },

    onSoundActive(soundName) {
        for (const sound of this.sounds) {
            if (sound.name === soundName) {
                this.audioSource.clip = sound.clip;
                this.audioSource.play(); 
            }
        }

    }

    // update (dt) {},
});
