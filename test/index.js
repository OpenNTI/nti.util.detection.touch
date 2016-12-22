'use strict';
require('babel-register');
require('babel-polyfill');
require('should');

const glob = require( 'glob' );

//This is for coverage and tests
glob.sync( `${__dirname}/../src/**/*.js` )
	.forEach(file => {
		if (!/src\/index.js/.test(file)) {
			require( file );
		}
	});
