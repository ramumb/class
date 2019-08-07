'use strict';

var expect = require('chai').expect;
var assignIn = require('lodash/assignIn');
var Class = require('../index');

describe('Class', function() {
  
  var Person = null;

  before(function(done) {
      Person = new Class();
      Person.prototype = {
        initialize: function(name) {
          this.name = name;
        },
        say: function(message) {
          return this.name + ': ' + message;
        }
      };
      
      return done();
  });

  describe('#constructor', function() {
    
      it('should return "Miro: hi"', function() {
          var guy = new Person('Miro');
          var result = guy.say('hi');
  
          expect(result).to.equal('Miro: hi');
      });
      
      it('should return OLD "Long John: ahoy matey, yarr!"', function() {
          var Pirate = new Class();
          // inherit from Person class:
          Pirate.prototype = assignIn(new Person(), {
            // redefine the speak method
            say: function(message) {
              return this.name + ': ' + message + ', yarr!';
            }
          });
  
          var john = new Pirate('Long John');
          var result = john.say('ahoy matey');
  
          expect(result).to.equal('Long John: ahoy matey, yarr!');
      });
      
      it('should return NEW "Long John: ahoy matey, yarr!"', function() {
          // when subclassing, specify the class you want to inherit from
          var Pirate = new Class(Person, {
            // redefine the speak method
            say: function($super, message) {
              return $super(message) + ', yarr!';
            }
          });
              
          var john = new Pirate('Long John');
          var result = john.say('ahoy matey');
  
          expect(result).to.equal('Long John: ahoy matey, yarr!');
      });
      
      it('should return "45"', function() {
          // define a module
          var Vulnerable = {
            wound: function(hp) {
              this.health -= hp;
              if (this.health < 0) this.kill();
            },
            kill: function() {
              this.dead = true;
            }
          };
              
          // the first argument isn't a class object, so there is no inheritance ...
          // simply mix in all the arguments as methods:
          var Person = new Class(Vulnerable, {
            initialize: function() {
              this.health = 100;
              this.dead = false;
            }
          });
              
          var bruce = new Person;
          bruce.wound(55);
          var result = bruce.health; //-> 45
  
          expect(result).to.equal(45);
      });
      
      it('should return "[\'foo\', \'bar\']"', function() {
          var Logger = new Class({
            initialize: function() { },
            log: [],
            write: function(message) {
              this.log.push(message);
            }
          });
              
          var logger = new Logger;
          logger.log; // -> []
          logger.write('foo');
          logger.write('bar');
          var result = logger.log; // -> ['foo', 'bar']
  
          expect(result).to.deep.equal(['foo', 'bar']);
      });
      
      it('should return "[\'Sea dog: 1, yarr!\', \'Sea dog: 2, yarr!\', \'Sea dog: 3, yarr!\']"', function() {
          var Pirate = new Class(Person, {
            // redefine the speak method
            say: function($super, message) {
              return $super(message) + ', yarr!';
            }
          });
  
          Pirate.allHandsOnDeck = function(n) {
            var voices = [];
            for (var i = 0; i < n; i++) {
                voices.push(new Pirate('Sea dog').say(i + 1));
            };
            return voices;
          };
              
          var result = Pirate.allHandsOnDeck(3);
          // -> ['Sea dog: 1, yarr!', 'Sea dog: 2, yarr!', 'Sea dog: 3, yarr!']
  
          expect(result).to.deep.equal(['Sea dog: 1, yarr!', 'Sea dog: 2, yarr!', 'Sea dog: 3, yarr!']);
      });
      
      it('should return "Long John: ZzZ, yarr!"', function() {
          var Pirate = new Class(Person, {
            // redefine the speak method
            say: function($super, message) {
              return $super(message) + ', yarr!';
            }
          });
  
          var john = new Pirate('Long John');
          //john.sleep();
          // -> ERROR: sleep is not a method
  
          // every person should be able to sleep, not just pirates!
          Person.extend({
            sleep: function() {
              return this.say('ZzZ');
            }
          });

          var result = john.sleep();
          // -> "Long John: ZzZ, yarr!"
  
          expect(result).to.equal('Long John: ZzZ, yarr!');
      });
      
      it('should return "Starting BMW"', function() {
          var Vehicle = new Class({
            start: function(message='vehicle') {
              return 'Starting ' + message;
            },
            stop: function(message='vehicle') {
              return 'Stopping ' + message;
            }
          });
  
          var Car = new Class(Vehicle, {
            start: function($super, message='car') {
              return $super(message);
            },
            drive: function(message='car') {
              return 'Driving ' + message;
            }
          });

          var BMW = new Car();

          var result = BMW.start('BMW');
          // -> "Starting BMW"
  
          expect(result).to.equal('Starting BMW');
      });

  });

});
