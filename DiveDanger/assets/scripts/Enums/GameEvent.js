export default cc.Enum({
    NONE: 0,

    LEFT_BUTTON_PRESSED: 1,
    LEFT_BUTTON_RELEASED: 2,
    RIGHT_BUTTON_PRESSED: 3,
    RIGHT_BUTTON_RELEASED: 4,
    UP_BUTTON_PRESSED: 5,
    UP_BUTTON_RELEASED: 6,
    DOWN_BUTTON_PRESSED: 7,
    DOWN_BUTTON_RELEASED: 8,
    USE_BUTTON_PRESSED: 9,
    USE_BUTTON_RELEASED: 10,

    SET_SUBMARINE_ROTATION: 100,

    SHIELD_DAMAGED: 101,
    SHOOT: 102,
    ENGINE_BROKEN: 103,
    ENGINE_FIXED: 104,

    //CharacterInWater
    CHARACTER_MOVE_START: 200,
    CHARACTER_MOVE_END: 201,
    
    // system parameters
    SHIELD_DESTROYED: 1001,
    OUT_OF_OXYGEN: 1002,
    OUT_OF_ARMS: 1003,
});