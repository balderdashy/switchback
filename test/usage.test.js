var should = require('should');
var EventEmitter = require('events').EventEmitter;

var switchback = require('../lib');

// Set up event bus to provide access to callback/switchback handler outcomes
var Bus = function () {
	this.afterFixture = function (fixtureID, cbOutcome, fnToCall) {
		return Bus.once(fixtureID, function (_outcome) {
			// cbOutcome should be an empty object at this point (passed by reference)
			cbOutcome.args = _outcome.args;
			cbOutcome.ctx = _outcome.ctx;
			fnToCall();
		});
	};
};
require('util').inherits(Bus, EventEmitter);
Bus = new Bus();

// Fixtures
var fixtures = {

	fn: function () {
		// Sniff call/caller data from this callback function by emitting event on cbReporter
		Bus.emit('fn', {
			args: Array.prototype.slice.call(arguments),
			ctx: this
		});
	},
	handlers: {
		success: function (data) {},
		error: function (err) {}
	}
};


// Suites
describe('switchback(Function)', function (){
	
	var sb;
	var cb = fixtures.fn;

	it('should return a switchback', function () {
		sb = switchback(cb);

		sb.should.be.a.Function;
		(switchback.isSwitchback(sb)).should.be.ok;
	});

	describe('when calling returned switchback as sb(null, 14, 23),', function () {
		var cbOutcome = {};
		it('should trigger callback', function (done) {
			// When callback fires, proceed
			Bus.afterFixture('fn', cbOutcome, done);

			// Usage
			sb(null, 14, 23);
		});

		it('should NOT receive error argument in original cb function', function () {
			should(cbOutcome.args).be.ok;
			should(cbOutcome.ctx).be.ok;
			cbOutcome.args.should.be.an.Array;
			cbOutcome.args.length.should.be.above(0);
			should(cbOutcome.args[0]).not.be.ok;
		});
		it('should receive the two subsequent arguments in original cb function', function () {
			should(cbOutcome.args).be.ok;
			should(cbOutcome.ctx).be.ok;
			cbOutcome.args.should.be.an.Array;
			cbOutcome.args.length.should.be.above(1);
			should(cbOutcome.args[1]).be.ok;
			should(cbOutcome.args[2]).be.ok;
		});
	});

	describe('when calling returned switchback with an error argument,', function () {
		
	});
});



describe('switchback(Handlers)', function (){
	
});

describe('switchback(Function, Object)', function (){
	
});

describe('switchback(Handlers, Object)', function (){
	
});


describe('switchback(Function, Object, Object)', function (){
	
});

describe('switchback(Handlers, Object, Object)', function (){
	
});


