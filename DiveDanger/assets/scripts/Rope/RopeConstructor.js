cc.Class({
    extends: cc.Component,

    properties: {
        startPart: {
            default: null,
            type: cc.Prefab
        },

        middlePart: {
            default: null,
            type: cc.Prefab
        },

        endPart: {
            default: null,
            type: cc.Prefab
        },

        lengthRope: {
            default: 10,
            type: cc.Integer
        },

        connectionEndRope: {
            default: null, 
            type: cc.RigidBody
        },

        _parts: {
            default: [],
            serializable: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //this._ropeConstruct();
    },

    _ropeConstruct() {

        //create start
        const start = cc.instantiate(this.startPart);
        start.parent = this.node;
        start.setPosition(cc.v2(0, 0));

        this._parts.push(start);

        //create middle parts
        for (let i = 1; i < this.lengthRope - 1; i++) {
            const part = cc.instantiate(this.middlePart);
            part.parent = this.node;
            part.setPosition(cc.v2(0, 0));
            this._parts.push(part);

            const joint = this._parts[i - 1].getComponent(cc.Joint);
            const rigidBody = part.getComponent(cc.RigidBody);
            joint.connectedBody = rigidBody;
            joint.apply();
        }

        const end = cc.instantiate(this.endPart);
        end.parent = this.node;
        end.setPosition(cc.v2(0, 0));

        this._parts.push(end);

        const joint = this._parts[this._parts.length - 2].getComponent(cc.Joint);
        const rigidBody = end.getComponent(cc.RigidBody);
        joint.connectedBody = rigidBody;
        joint.apply();

        // const jointEnd = end.getComponent(cc.Joint);
        // const rigidBodyForEndRope = this.connectionEndRope.getComponent(cc.RigidBody);
        // jointEnd.connectedBody = rigidBodyForEndRope;
        // jointEnd.apply();

    },

    _destroyRope() {
        for (let i = 0; i < this.lengthRope; i++) {
            this._parts[i].destroy();
        }

        this._parts = [];
    }
});
