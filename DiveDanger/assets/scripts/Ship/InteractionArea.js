import ProducerAnimator from 'ProducerAnimator';

cc.Class({
    extends: cc.Component,

    properties: {
        startInteractionCall: {
            default: null,
            visible: false
        },

        endInteractionCall: {
            default: null,
            visible: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable() {
        this.scheduleOnce(() => {
            // we look at several cases
            // start and end interaction callbacks depend on type of interaction area

            if (this.getComponent(ProducerAnimator)) {
                const producerAnimator = this.getComponent(ProducerAnimator);
                this.startInteractionCall = producerAnimator.startRepair.bind(producerAnimator);
                this.endInteractionCall = producerAnimator.stopRepair.bind(producerAnimator);
            }
        })
    },

    // public methods
    startInteraction() {
        //cc.log('start interaction');
        this.startInteractionCall && this.startInteractionCall();
    },

    stopInteraction() {
        this.endInteractionCall && this.endInteractionCall();
    }
});
