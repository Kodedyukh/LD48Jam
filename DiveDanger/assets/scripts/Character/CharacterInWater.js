import GameEvent from 'GameEvent';
import EngineRepairArea from 'EngineRepairArea';

cc.Class({
    extends: cc.Component,

    properties: {
        velocity: {
            default: 10,
            type: cc.Integer
        },

        interactionMark: {
            default: null,
            type: cc.Node
        },

        _body: {
            default: null,
            serializable: false
        },

        _isActiveCharacter: {
            default: false,
            serializable: false,
            visible: false
        },

        _engineRepairArea: {
            default: null,
            serializable: false
        }
    },

    onEnable() {
        this._body = this.getComponent(cc.RigidBody);

        this._handlerSubscribe(true);    
    },

    onDisable() {
        this._handlerSubscribe(false);    
    },
    
    _handlerSubscribe(isOn) {
        const func = isOn ? 'on' : 'off';

        cc.systemEvent[func](GameEvent.CHARACTER_MOVE_START, this.onCharacterMoveStart, this);
        cc.systemEvent[func](GameEvent.CHARACTER_MOVE_END, this.onCharacterMoveEnd, this);
        cc.systemEvent[func](GameEvent.USE_BUTTON_PRESSED, this.onUseButtonPressed, this);
        cc.systemEvent[func](GameEvent.USE_BUTTON_RELEASED, this.onUseButtonReleased, this);
    },

    toggleActiveCharacter(isOn) {
        this._isActiveCharacter = isOn;
        this._body.linearVelocity = cc.v2(0, 0);
    },

    onCharacterMoveStart(direction) {
        // const x = this._body.linearVelocity.x + direction.x * this.velocity;
        // const y = this._body.linearVelocity.y + direction.y * this.velocity;

        if(this._isActiveCharacter) {
            const x = direction.x ? direction.x * this.velocity : this._body.linearVelocity.x;
            const y = direction.y ? direction.y * this.velocity : this._body.linearVelocity.y;
    
            const velocity = cc.v2(x, y);
            this._body.linearVelocity = velocity;
        }
    },

    onCharacterMoveEnd(direction) {
        // const x = this._body.linearVelocity.x - direction.x * this.velocity;
        // const y = this._body.linearVelocity.y - direction.y * this.velocity;

        if (this._isActiveCharacter) {
            const x = direction.x && (direction.x * this.velocity === this._body.linearVelocity.x) ? 0 : this._body.linearVelocity.x;
            const y = direction.y && (direction.y * this.velocity === this._body.linearVelocity.y) ? 0 : this._body.linearVelocity.y;
    
            const velocity = cc.v2(x, y);
            this._body.linearVelocity = velocity;
        }

    },

    onUseButtonPressed() {
        if (this._engineRepairArea) {
            this._engineRepairArea.startRepair();
        }
    },

    onUseButtonReleased() {
        if (this._engineRepairArea) {
            this._engineRepairArea.stopRepair();
        }
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        const otherGroupName = otherCollider.node.group;

        switch (otherGroupName) {
            case 'engine':

                const repairArea = otherCollider.node.getComponent(EngineRepairArea);

                if (repairArea && otherCollider.tag === 1) {
                    this._engineRepairArea = repairArea;
                    this.interactionMark.opacity = 255;
                }

                

                break;

        }
    },

    onEndContact(contact, selfCollider, otherCollider) {
        const otherGroupName = otherCollider.node.group;

        switch (otherGroupName) {
            case 'engine':

                const repairArea = otherCollider.node.getComponent(EngineRepairArea);

                if (repairArea && this._engineRepairArea && otherCollider.tag === 1) {
                    this._engineRepairArea.stopRepair();
                    this._engineRepairArea = null;
                    this.interactionMark.opacity = 0;
                }

                

                break;
        }
    }
});
