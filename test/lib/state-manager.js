/*var studentsStub = { getEnrolled: function(subject){} };
define("students", [], studentsStub);
*/

define(['knockout', 'stateManager'], function (ko, stateManagerFactory) {
    'use strict';

    describe('State Manager URL parsing functions', function () {
        beforeEach(function () {

        });
        afterEach(function () {
            stateManagerFactory._destroy();
        });

        it('Creates state object from fragment URL', function () {

            // see require.config.js for tests to see why does this work
            setFakeLocation("http: //dashiki.com/#projects=enwiki,dewiki/metrics=newlyregister,rollingactive");

            var defaultProjects = ['enwiki', 'dewiki'];
            var defaultMetric = 'newlyregister';


            var stateManager = stateManagerFactory.getManager(ko.observable([]), ko.observable(),
                ko.observable([]), ko.observable());

            expect(stateManager.defaultProjects()[0]).toEqual('enwiki');
            expect(stateManager.defaultMetrics()[0]).toEqual('newlyregister');

        });


        it('Creates right url fragment from state', function () {
            // see require.config.js for tests to see why does this work
            setFakeLocation("http: //dashiki.com/");
            var fragment = "projects=enwiki,dewiki/metrics=newlyregister";

            //constructing things as they come from the API
            var defaultProjects = [{
                name: 'blah',
                database: 'enwiki'
            }, {
                name: 'blah',
                database: 'dewiki'
            }];
            var defaultMetric = {
                name: 'newlyregister'
            };

            var stateManager = stateManagerFactory.getManager(ko.observable(defaultProjects), ko.observable(defaultMetric),
                ko.observable([]), ko.observable());

            // this should trigger computation
            var state = stateManager.getState();
            expect(state.toString()).toEqual(fragment);
        });

        it('Zero case', function () {

            // see require.config.js for tests to see why does this work
            setFakeLocation("http: //dashiki.com/");
            var defaultProjects = ko.observable([]);
            var defaultMetric = ko.observable();


            var stateManager = stateManagerFactory.getManager(defaultProjects, defaultMetric,
                ko.observable([]), ko.observable());
            // this should trigger computation
            var state = stateManager.getState();
            expect(state.toString()).toEqual('empty');
        });

    });
});
