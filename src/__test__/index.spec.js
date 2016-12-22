/*eslint no-console: 0*/
const mock = require('mock-require');

describe('Tests', () => {

	it ('Imports on node', () => {
		mock.reRequire('../index');
	});

	describe ('Simulated Browser', () => {
		beforeEach(() => {
			global.navigator = {};
			process.browser = true;
		});

		afterEach(() => {
			delete global.document;
			delete global.ontouchstart;
			delete global.onmsgesturechange;
			delete global.navigator;
			delete global.PointerEvent;
			delete process.browser;
		});

		it ('Minimal browser env', () => {
			const {
				default: isTouchDevice,
				PointerEvents,
				touchActionSupported,
				passiveEventListenerSupported
			} = mock.reRequire('../index');

			isTouchDevice.should.be.false();
			touchActionSupported.should.be.false();
			passiveEventListenerSupported.should.be.false();
			PointerEvents.pointerDown.should.be.equal('mousedown');
		});

		it ('Touch env (maxTouchPoints = undefined) should report isTouchDevice = true', () => {
			global.ontouchstart = null;//key present
			const {
				default: isTouchDevice
			} = mock.reRequire('../index');

			isTouchDevice.should.be.true();
		});

		it ('Touch env (maxTouchPoints = 0) should report isTouchDevice = false', () => {
			global.ontouchstart = null;//key present
			global.navigator.maxTouchPoints = 0;
			const {
				default: isTouchDevice
			} = mock.reRequire('../index');

			isTouchDevice.should.be.false();
		});

		it ('Touch env (IE 10, msMaxTouchPoints = 0) should report isTouchDevice = false', () => {
			global.onmsgesturechange = null;//key present
			global.navigator.msMaxTouchPoints = 0;
			const {
				default: isTouchDevice
			} = mock.reRequire('../index');

			isTouchDevice.should.be.false();
		});

		it ('Touch env (maxTouchPoints > 0) should report isTouchDevice = true', () => {
			global.ontouchstart = null;//key present
			global.navigator.maxTouchPoints = 2;
			const {
				default: isTouchDevice
			} = mock.reRequire('../index');

			isTouchDevice.should.be.true();
		});

		it ('Touch env (IE 10, msMaxTouchPoints > 0) should report isTouchDevice = true', () => {
			global.onmsgesturechange = null;//key present
			global.navigator.msMaxTouchPoints = 2;
			const {
				default: isTouchDevice
			} = mock.reRequire('../index');

			isTouchDevice.should.be.true();
		});

		it ('PointerEvents (PointerEvent is undefined, isTouchDevice = false) defaults to mouse events', () => {
			const {PointerEvents} = mock.reRequire('../index');

			PointerEvents.pointerDown.should.be.equal('mousedown');
			PointerEvents.pointerEnter.should.be.equal('mouseenter');
			PointerEvents.pointerLeave.should.be.equal('mouseleave');
			PointerEvents.pointerMove.should.be.equal('mousemove');
			PointerEvents.pointerOut.should.be.equal('mouseout');
			PointerEvents.pointerOver.should.be.equal('mouseover');
			PointerEvents.pointerUp.should.be.equal('mouseup');
		});

		it ('PointerEvents (PointerEvent is undefined, isTouchDevice = true) sets touch events', () => {
			global.ontouchstart = null;//key present
			const {PointerEvents} = mock.reRequire('../index');

			PointerEvents.pointerDown.should.be.equal('touchstart');
			PointerEvents.pointerEnter.should.be.equal('touchenter');
			PointerEvents.pointerLeave.should.be.equal('touchleave');
			PointerEvents.pointerMove.should.be.equal('touchmove');
			PointerEvents.pointerOut.should.be.equal('touchcancel');
			PointerEvents.pointerOver.should.be.equal('-NA-');
			PointerEvents.pointerUp.should.be.equal('touchend');
		});

		it ('PointerEvents (PointerEvent is defined, isTouchDevice = false) sets pointer events', () => {
			global.PointerEvent = {};//Key value is not 'undefined'
			const {PointerEvents} = mock.reRequire('../index');

			PointerEvents.pointerDown.should.be.equal('pointerdown');
			PointerEvents.pointerEnter.should.be.equal('pointerenter');
			PointerEvents.pointerLeave.should.be.equal('pointerleave');
			PointerEvents.pointerMove.should.be.equal('pointermove');
			PointerEvents.pointerOut.should.be.equal('pointerout');
			PointerEvents.pointerOver.should.be.equal('pointerover');
			PointerEvents.pointerUp.should.be.equal('pointerup');
		});

		it ('PointerEvents (PointerEvent is defined, isTouchDevice = true) sets pointer events', () => {
			global.ontouchstart = null;//key present
			global.PointerEvent = {};//Key value is not 'undefined'
			const {PointerEvents} = mock.reRequire('../index');

			PointerEvents.pointerDown.should.be.equal('pointerdown');
			PointerEvents.pointerEnter.should.be.equal('pointerenter');
			PointerEvents.pointerLeave.should.be.equal('pointerleave');
			PointerEvents.pointerMove.should.be.equal('pointermove');
			PointerEvents.pointerOut.should.be.equal('pointerout');
			PointerEvents.pointerOver.should.be.equal('pointerover');
			PointerEvents.pointerUp.should.be.equal('pointerup');
		});

		it ('touchActionSupported is true, only when an element\'s touch-action style property retains all the values', () => {
			global.document = {
				createElement: () => ({
					style: {
						setProperty (k,v) { this[k] = v; },
						getPropertyValue (k) { return this[k]; }
					}
				})
			};

			const { touchActionSupported } = mock.reRequire('../index');
			touchActionSupported.should.be.true();
		});

		it ('touchActionSupported is false, when an element\'s touch-action style property does not retains any of the values', () => {
			const allow = {auto: 1, none: 1};
			global.document = {
				createElement: () => ({
					style: {
						setProperty (k,v) { this[k] = allow[k] ? v : void v; },
						getPropertyValue (k) { return this[k]; }
					}
				})
			};

			const { touchActionSupported } = mock.reRequire('../index');
			touchActionSupported.should.be.false();
		});

		it ('passiveEventListenerSupported is true only when addEventListener reads the passive property from the third argument', () => {
			const original = global.addEventListener;
			global.addEventListener = (_, __, ops) => ops.passive === ''; //just trigger a 'get' on the passive property.

			try {
				const { passiveEventListenerSupported } = mock.reRequire('../index');
				passiveEventListenerSupported.should.be.true();
			}
			finally {
				//put it back
				global.addEventListener = original;
			}
		});

	});
});
