/*global define */
define({

	CHANGE_XY: 'camera:change-xy',
	BOUNDS_UPDATED: 'camera:bounds-updated',
	ADJUST_SPRITE: 'camera:adjust-sprite',
	FOLLOW_TO: 'camera:follow-to',
	PX: 1, 		// here use number instead of strings cause this parameter will collected to array of number
	REM: 16 	// PX === 1, cause 1px === 1px, rem === 16 cause usually 1rem === 16px, and I do not want use 'edge number' like 0 or Infinity

});
