/*
 * @credits: http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
 */
const isTouchDevice = process.browser && (
	'ontouchstart' in global || // everyone else
	'onmsgesturechange' in global //IE10
	);

export default isTouchDevice;

export const PointerEvents = typeof PointerEvent !== 'undefined'
	? {
		pointerDown: 'pointerdown',
		pointerEnter: 'pointerenter',
		pointerLeave: 'pointerleave',
		pointerMove: 'pointermove',
		pointerOut: 'pointerout',
		pointerOver: 'pointerover',
		pointerUp: 'pointerup'
	}
	: isTouchDevice
		? {
			pointerDown: 'touchstart',
			pointerEnter: 'touchenter',
			pointerLeave: 'touchleave',
			pointerMove: 'touchmove',
			pointerOut: 'touchcancel',
			pointerOver: '-NA-',
			pointerUp: 'touchend'
		}
		: {
			pointerDown: 'mousedown',
			pointerEnter: 'mouseenter',
			pointerLeave: 'mouseleave',
			pointerMove: 'mousemove',
			pointerOut: 'mouseout',
			pointerOver: 'mouseover',
			pointerUp: 'mouseup'
		};


function hasTouchActionSupport() {
	if (typeof document === 'undefined') {return false;}

	const div = document.createElement('div');
	const set = (v) => div.style.setProperty('touch-action', v);
	const isSet = (v) => div.style.getPropertyValue('touch-action') === v;

	return ['none', 'auto', 'pan-x', 'pan-y', 'manipulation'].reduce((supported, value) => (set(value), supported && isSet(value)), true);
}

function hasPassiveEventListenerSupport() {
	let supported = false;
	try {
		addEventListener('test', null, Object.defineProperty({}, 'passive', {get () { supported = true; }}));
	} catch (e) {}
	return supported;
}

export const passiveEventListenerSupported = hasPassiveEventListenerSupport();
export const touchActionSupported = hasTouchActionSupport();
