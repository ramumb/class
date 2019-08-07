'use strict';

var assignIn = require('lodash/assignIn');
var noop = require('lodash/noop');
var concat = require('lodash/concat');
//var _wrap = require('lodash/wrap');

/**
 * This is a port of the PrototypeJS method stripTags.
 * It strips a string of any HTML tags.
 * @param {string}  A string from which to strip HTML tags
 * @return {string} The result of the function
 */

/*
var IS_DONTENUM_BUGGY = (function() {
	for (var p in { toString: 1 }) {
		// check actual property name, so that it works with augmented Object.prototype
		if (p === 'toString') return false;
	}
	return true;
})();*/

function getArgs(fn) {
	var args = fn.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
		.replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
		.replace(/\s+/g, '').split(',');
	return args.length == 1 && !args[0] ? [] : args;
};

/*function update(array, args) {
	var arrayLength = array.length, length = args.length;
	while (length--) array[arrayLength + length] = args[length];
	return array;
}*/

function wrap(fn, wrapper) {
	return function() {
		var a = concat([fn.bind(this)], arguments);
		return wrapper.apply(this, a);
	}
};

/*function mixin(destination, source) {
	for (var property in source)
		destination[property] = source[property];
	return destination;
};*/

/*var subclass = noop;*/

/*function empty() {};*/

function extend(source) {
	var ancestor = this.superclass && this.superclass.prototype,
		properties = Object.keys(source);

	// IE6 doesn't enumerate `toString` and `valueOf` (among other built-in `Object.prototype`) properties,
	// Force copy if they're not Object.prototype ones.
	// Do not copy other Object.prototype.* for performance reasons
	/*if (IS_DONTENUM_BUGGY) {
		if (source.toString != Object.prototype.toString)
			properties.push("toString");

		if (source.valueOf != Object.prototype.valueOf)
			properties.push("valueOf");
	}*/

	for (var i = 0, length = properties.length; i < length; i++) {
		var property = properties[i], value = source[property];

		if (ancestor && (typeof(value) === 'function') && getArgs(value)[0] === '$super') {
			var method = value;

			value = wrap((function(m) {
				return function() { return ancestor[m].apply(this, arguments); };
			})(property), method);

			// We used to use `bind` to ensure that `toString` and `valueOf`
			// methods were called in the proper context, but now that we're 
			// relying on native bind and/or an existing polyfill, we can't rely
			// on the nuanced behavior of whatever `bind` implementation is on
			// the page.
			//
			// MDC's polyfill, for instance, doesn't like binding functions that
			// haven't got a `prototype` property defined.
			value.valueOf = (function(method) {
				return function() { return method.valueOf.call(method); };
			})(method);

			value.toString = (function(method) {
				return function() { return method.toString.call(method); };
			})(method);
		}

		this.prototype[property] = value;
	}

	return this;
};

var Methods = {
    extend: extend
};

function Class(str) {
    var parent = null, properties = Array.from(arguments);

	if (typeof(properties[0]) === 'function')
		parent = properties.shift();

	function klass() {
		this.initialize.apply(this, arguments);
	}

	assignIn(klass, Methods);
	klass.superclass = parent;
	klass.subclasses = [];

	if (parent) {
		noop.prototype = parent.prototype;
		klass.prototype = new noop;
		parent.subclasses.push(klass);
	}

	for (var i = 0, length = properties.length; i < length; i++)
		klass.extend(properties[i]);

	if (!klass.prototype.initialize)
		klass.prototype.initialize = noop;

	klass.prototype.constructor = klass;
	return klass;
}

module.exports = Class;
