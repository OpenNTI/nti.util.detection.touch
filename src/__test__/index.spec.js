/* eslint-env jest */

function before() {
	jest.clearAllMocks();
	jest.resetAllMocks();
	jest.resetModules();
	process.browser = true;
	global.navigator = {};
	global.window = {};
	delete global.document;
}

function after() {
	jest.resetModules();
	delete global.document;
}

test('Imports on node', () => {
	require('../index.js');
});

describe('Simulated Browser', () => {
	beforeEach(before);
	afterEach(after);

	test('Minimal browser env', () => {
		const {
			default: isTouchDevice,
			PointerEvents,
			touchActionSupported,
			passiveEventListenerSupported,
		} = require('../index.js');

		expect(isTouchDevice).toBeFalsy();
		expect(touchActionSupported).toBeFalsy();
		expect(passiveEventListenerSupported).toBeFalsy();
		expect(PointerEvents.pointerDown).toEqual('mousedown');
	});

	test('Touch env (maxTouchPoints = undefined) should report isTouchDevice = true', () => {
		window.ontouchstart = null; //key present
		const { default: isTouchDevice } = require('../index.js');

		expect(isTouchDevice).toBe(true);
	});

	test('Touch env (maxTouchPoints = 0) should report isTouchDevice = false', () => {
		window.ontouchstart = null; //key present
		navigator.maxTouchPoints = 0;
		const { default: isTouchDevice } = require('../index.js');

		expect(isTouchDevice).toBe(false);
	});

	test('Touch env (IE 10, msMaxTouchPoints = 0) should report isTouchDevice = false', () => {
		window.onmsgesturechange = null; //key present
		navigator.msMaxTouchPoints = 0;
		const { default: isTouchDevice } = require('../index.js');

		expect(isTouchDevice).toBe(false);
	});

	test('Touch env (maxTouchPoints > 0) should report isTouchDevice = true', () => {
		window.ontouchstart = null; //key present
		navigator.maxTouchPoints = 2;
		const { default: isTouchDevice } = require('../index.js');

		expect(isTouchDevice).toBe(true);
	});

	test('Touch env (IE 10, msMaxTouchPoints > 0) should report isTouchDevice = true', () => {
		window.onmsgesturechange = null; //key present
		navigator.msMaxTouchPoints = 2;
		const { default: isTouchDevice } = require('../index.js');

		expect(isTouchDevice).toBe(true);
	});

	test('PointerEvents (PointerEvent is defined, isTouchDevice = true) sets pointer events', () => {
		window.ontouchstart = null; //key present
		window.PointerEvent = {}; //Key value is not 'undefined'
		const { PointerEvents } = require('../index.js');

		expect(PointerEvents.pointerDown).toEqual('pointerdown');
		expect(PointerEvents.pointerEnter).toEqual('pointerenter');
		expect(PointerEvents.pointerLeave).toEqual('pointerleave');
		expect(PointerEvents.pointerMove).toEqual('pointermove');
		expect(PointerEvents.pointerOut).toEqual('pointerout');
		expect(PointerEvents.pointerOver).toEqual('pointerover');
		expect(PointerEvents.pointerUp).toEqual('pointerup');
	});

	test('PointerEvents (PointerEvent is defined, isTouchDevice = false) sets pointer events', () => {
		window.PointerEvent = {}; //Key value is not 'undefined'
		const { PointerEvents } = require('../index.js');

		expect(PointerEvents.pointerDown).toEqual('pointerdown');
		expect(PointerEvents.pointerEnter).toEqual('pointerenter');
		expect(PointerEvents.pointerLeave).toEqual('pointerleave');
		expect(PointerEvents.pointerMove).toEqual('pointermove');
		expect(PointerEvents.pointerOut).toEqual('pointerout');
		expect(PointerEvents.pointerOver).toEqual('pointerover');
		expect(PointerEvents.pointerUp).toEqual('pointerup');
	});

	test('PointerEvents (PointerEvent is undefined, isTouchDevice = false) defaults to mouse events', () => {
		const { PointerEvents, isTouchDevice } = require('../index.js');

		expect(isTouchDevice).toBeFalsy();
		expect(PointerEvents.pointerDown).toEqual('mousedown');
		expect(PointerEvents.pointerEnter).toEqual('mouseenter');
		expect(PointerEvents.pointerLeave).toEqual('mouseleave');
		expect(PointerEvents.pointerMove).toEqual('mousemove');
		expect(PointerEvents.pointerOut).toEqual('mouseout');
		expect(PointerEvents.pointerOver).toEqual('mouseover');
		expect(PointerEvents.pointerUp).toEqual('mouseup');
	});

	test('PointerEvents (PointerEvent is undefined, isTouchDevice = true) sets touch events', () => {
		window.ontouchstart = null; //key present
		const { PointerEvents } = require('../index.js');

		expect(PointerEvents.pointerDown).toEqual('touchstart');
		expect(PointerEvents.pointerEnter).toEqual('touchenter');
		expect(PointerEvents.pointerLeave).toEqual('touchleave');
		expect(PointerEvents.pointerMove).toEqual('touchmove');
		expect(PointerEvents.pointerOut).toEqual('touchcancel');
		expect(PointerEvents.pointerOver).toEqual('-NA-');
		expect(PointerEvents.pointerUp).toEqual('touchend');
	});

	test("touchActionSupported is true, only when an element's touch-action style property retains all the values", () => {
		global.document = {
			createElement: () => ({
				style: {
					setProperty(k, v) {
						this[k] = v;
					},
					getPropertyValue(k) {
						return this[k];
					},
				},
			}),
		};

		const { touchActionSupported } = require('../index.js');
		expect(touchActionSupported).toBe(true);
	});

	test("touchActionSupported is false, when an element's touch-action style property does not retains any of the values", () => {
		const allow = { auto: 1, none: 1 };
		global.document = {
			createElement: () => ({
				style: {
					setProperty(k, v) {
						this[k] = allow[k] ? v : void v;
					},
					getPropertyValue(k) {
						return this[k];
					},
				},
			}),
		};

		const { touchActionSupported } = require('../index.js');
		expect(touchActionSupported).toBe(false);
	});

	test('passiveEventListenerSupported is true only when addEventListener reads the passive property from the third argument', () => {
		const original = global.addEventListener;
		global.addEventListener = (_, __, ops) => ops.passive === ''; //just trigger a 'get' on the passive property.

		try {
			const { passiveEventListenerSupported } = require('../index.js');
			expect(passiveEventListenerSupported).toBe(true);
		} finally {
			//put it back
			global.addEventListener = original;
		}
	});
});
