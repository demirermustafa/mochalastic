'use strict';

var sinon = require('sinon');
var Mocha = require('Mocha');
var Mochalastic = require('./../lib/mochalastic.js');
const {Client} = require('@elastic/elasticsearch');
var Suite = Mocha.Suite;
var Runner = Mocha.Runner;
var Test = Mocha.Test;
var expect = require("chai").expect;

describe('Mochalistic reporter', function () {
  var sandbox;
  var suite;
  var runner;
  var testTitle = 'json test 1';
  var noop = function () {};

  beforeEach(function () {
    var mocha = new Mocha({
      reporter: Mochalastic
    });

    suite = new Suite('Mochalastic Suite', 'root');
    runner = new Runner(suite);
  
    var options = {
      reporterOptions: {
        nodeUris: 'https://localhost:9243',
        username: 'username',
        password: 'password',
        project: 'SampleTest',
        suite: 'some test suite key',
        indexPrefix: 'test-results'
      }
    };
    var mochaReporter = new mocha._reporter(runner, options);
    sandbox = sinon.createSandbox();
   });

  afterEach(function () {
    sandbox.restore();
  });

  it('should have 1 test failure', function (done) {
    var error = {
      message: 'oh error'
    };

    suite.addTest(
      new Test(testTitle, function (done) {
        done(new Error(error.message));
      })
    );

    runner.run(function (failureCount) {
      sandbox.restore();
      expect(runner, 'to satisfy', {
        testResults: {
          failures: [{
            title: testTitle,
            err: {
              message: error.message
            }
          }]
        }
      });
      expect(failureCount, 'to be', 1);
      done();
    });
  });

});
