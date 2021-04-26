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

    MOUSE_DOWN: 21,
    MOUSE_MOVE: 22,
    MOUSE_UP: 23,

    SET_SUBMARINE_ROTATION: 100,

    SHIELD_DAMAGED: 101,
    SHOOT: 102,
    ENGINE_TOGGLE: 103,

    //CharacterInWater
    CHARACTER_MOVE_START: 200,
    CHARACTER_MOVE_END: 201,

    //Rope
    ROPE_TOGGLE: 300,

    //Diver
    DIVER_ENTER: 400,

    //Turret
    TURRET_ENTER: 500,

    // system parameters
    SHIELD_DESTROYED: 1001,
    OUT_OF_OXYGEN: 1002,
    OUT_OF_ARMS: 1003,

    GET_TARGETS: 1100,
    ENGINE_BROKEN: 1101,
    ENGINE_FIXED: 1102,
    ENGINES_STOP: 1103,

    //enemy
    ENEMY_DESTROYED: 1201,

    //
    TOGGLE_PAUSE: 1301,
    TIME_TO_WAVE: 1302,
    LAST_WAVE_DESTROYED: 1303
});