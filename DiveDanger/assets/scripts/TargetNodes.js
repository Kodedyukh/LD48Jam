import GameEvent from 'GameEvent';

cc.Class({
    extends: cc.Component,

    properties: {
        targetNodes: { default: [], type: cc.Node },
        _targets: { default: null, serializable: false }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._targets = [];
        this.targetNodes.forEach(n => {
            this._targets.push({ node: n, hp: 10 });
        });
        this._handleSubscription(true);
    },

    start () {

    },

    _handleSubscription(isOn) {
        const func = isOn ? 'on' : 'off';

        cc.systemEvent[func](GameEvent.GET_TARGET_ENGINES, this.onGetTargetNodes, this);
        cc.systemEvent[func](GameEvent.ENGINE_DAMAGED, this.onEngineDamaged, this);
    },

    onGetTargetNodes(callback) {
        typeof callback === 'function' && callback(this._targets.filter(t => t.hp > 0).map(t => t.node));
    },

    onEngineDamaged(node) {
        const target = this._targets.find(t => t.node === node);
        if (target) {
            target.hp--;
        }
    }
});
