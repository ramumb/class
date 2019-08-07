Class(function)
========================================

[![Build Status](https://travis-ci.org/ramumb/class.svg?branch=master)](https://travis-ci.org/ramumb/class)
[![Coverage Status](https://coveralls.io/repos/github/ramumb/class/badge.svg?branch=master)](https://coveralls.io/github/ramumb/class?branch=master)

This is a port of the [PrototypeJS](http://prototypejs.org/) class-based OOP system.

Class([superclass][, methods...]) -> Class
  - superclass (Class): The optional superclass to inherit methods from.
  - methods (Object): An object whose properties will be "mixed-in" to the
    new class. Any number of mixins can be added; later mixins take precedence.

[[Class]] creates a class and returns a constructor function for
instances of the class. Calling the constructor function (typically as
part of a `new` statement) will invoke the class's `initialize` method.

[[Class]] accepts two kinds of arguments. If the first argument is a [[Class]],
it's used as the new class's superclass, and all its methods are inherited.
Otherwise, any arguments passed are treated as objects, and their methods are
copied over ("mixed in") as instance methods of the new class. In cases of
method name overlap, later arguments take precedence over earlier arguments.

If a subclass overrides an instance method declared in a superclass, the
subclass's method can still access the original method. To do so, declare
the subclass's method as normal, but insert `$super` as the first argument.
This makes `$super` available as a method for use within the function.

To extend a class after it has been defined, use [[Class#extend]].

## Browser Support

  * Microsoft Internet Explorer for Windows, version 6.0 and higher
  * Mozilla Firefox 1.5 and higher
  * Apple Safari 2.0.4 and higher
  * Opera 9.25 and higher
  * Chrome 1.0 and higher

## Installation

  `npm install @ramumb/class`

## Usage

    var Class = require('class');

    // properties are directly passed to `create` method
    var Person = new Class({
      initialize: function(name) {
        this.name = name;
      },
      say: function(message) {
        return this.name + ': ' + message;
      }
    });
        
    // when subclassing, specify the class you want to inherit from
    var Pirate = new Class(Person, {
      // redefine the speak method
      say: function($super, message) {
        return $super(message) + ', yarr!';
      }
    });
        
    var john = new Pirate('Long John');
    john.say('ahoy matey');
    // -> "Long John: ahoy matey, yarr!"

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test your
code.  See the [CONTRIBUTING](CONTRIBUTING.md) file for more detailed information.
