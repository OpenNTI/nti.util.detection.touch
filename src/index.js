const firstNonNull = (value, key) => value != null ? value : global.navigator[key];
const MaxTouchPoints = typeof navigator !== 'undefined' ? (['msMaxTouchPoints', 'maxTouchPoints'].reduce(firstNonNull, null)) : null;
const hasMaxTouchPoints = MaxTouchPoints != null;
const isTouchDevice = process.browser && typeof window !== 'undefined' && (
	'ontouchstart' in window || // everyone else
	'onmsgesturechange' in window //IE10
)
	&& (!hasMaxTouchPoints || MaxTouchPoints > 0);

export default isTouchDevice;

export const PointerEvents = typeof window !== 'undefined' && window.PointerEvent != null
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


export const touchActionSupported = (function () {
	if (typeof document === 'undefined') {return false;}

	const div = document.createElement('div');
	const set = (v) => div.style.setProperty('touch-action', v);
	const isSet = (v) => div.style.getPropertyValue('touch-action') === v;

	return ['none', 'auto', 'pan-x', 'pan-y', 'manipulation'].reduce((supported, value) => (set(value), supported && isSet(value)), true);
}());

export const passiveEventListenerSupported = (function () {
	let supported = false;
	try {
		global.addEventListener('test', null, Object.defineProperty({}, 'passive', {get () { supported = true; }}));
	} catch (e) {/**/}
	return supported;
}());
