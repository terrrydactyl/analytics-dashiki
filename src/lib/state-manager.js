'use strict';
/**
 * Knows how to translate from the URL to an application state
 * and (in the future) will mutate the url reading the application state
 * as user adds/removes metrics.
 *
 * We are not trying to support back/forwards functionallity client side
 * but rather easy bookmarking on dashboard state.
 *
 * If the url is 'plain' (no state) it falls back to config api to retrieve
 * the default settings for bootstrap.
 *
 * State urls are of the form:
 * http: //dashiki.com/something#projects=enwiki,dewiki/metrics=newlyregister,rollingactive
 **/
define(function (require) {
    var ko = require('knockout'),
        configApi = require('apis.config'),
        URI = require('uri/URI'),
        window = require('window');

    /**
     * NullObject for the state
     * will represent empty state eventually
     **/
    function EmptyState() {
        return;
    }


    EmptyState.prototype.toString = function () {
        // placeholder for emptystate
        // needs to return something to put after the hash or
        // a plain reset of window.location will reload forever
        return 'empty';
    };

    /**
     * @param projects Array of string
     * @param metrics Array of strings
     **/
    function State(projects, metrics) {

        if (!projects) {
            projects = [];
        }
        if (!metrics) {
            metrics = [];
        } else if (typeof metrics === 'string') {
            // if metrics is not an array, make it so
            metrics = [metrics];
        }
        this.metrics = metrics;
        this.projects = projects;
    }

    /**
    *
    * From: {
         "defaultProjects": [
             "enwiki", "eswiki", "dewiki", "frwiki", "ruwiki", "jawiki", "itwiki"
            ],
        "defaultMetrics": [
             "RollingActiveEditor", "NewlyRegistered"
        ]
    }
    * To: projects = enwiki, dewiki / metrics = newlyregister, rollingactive
    */
    State.prototype.buildHashFragment = function () {

        var projects = 'projects=' + this.projects.join(',');
        var metrics = 'metrics=' + encodeURIComponent(this.metrics.join(','));
        return projects + '/' + metrics;
    };

    /**
     * Returns the state as a hash fragment, like: projects=euwiki/metrics=RollingActiveEditor
     **/
    State.prototype.toString = function () {
        return this.buildHashFragment();
    };

    /**
    * Static function that from a url gets a state object
    * only used in bootstrap
    * From projects = enwiki, dewiki / metrics = newlyregister, rollingactive
    * To: {
        "defaultProjects": [
             "enwiki", "eswiki", "dewiki", "frwiki", "ruwiki", "jawiki", "itwiki"
        ],
        "defaultMetrics": [
             "RollingActiveEditor", "NewlyRegistered"
        ]
    }
     **/
    State.splitStateURL = function (hash) {
        var state = { projects: [], metrics: [] };
        var defaults = hash.split('/');

        defaults.forEach(function (item) {
            var choice = item.split('=');

            if (choice.length > 1) {
                state[choice[0]] = choice[1].split(',').map(decodeURIComponent);
            }
        });
        return new State(state.projects, state.metrics);
    };


    /**
     * In order to change the url as state changes are happening
     * state manager needs to know about selected projects and selected metrics
     * params:
     *  selectedProjects
     *  selectedMetric
     *  callback(state): function that gets executed when the initialization of the state is completed
     **/
    function StateManager(selectedProjects, selectedMetric, defaultProjects, defaultMetrics) {

        //selected projects and selected metrics are observables
        this.selectedProjects = selectedProjects;
        this.selectedMetric = selectedMetric;
        this.defaultProjects = defaultProjects;
        this.defaultMetrics = defaultMetrics;

        this.state = null;

        this.init();

    }

    /**
     * Looks at url to see if we need to bootsrap from the url hash
     * if not it bootstraps the state of the application
     * from the config.
     **/
    StateManager.prototype.init = function () {
        var self = this;
        //gives you a nice object from window.location
        var uri = new URI().normalizeHash();
        // hash without '#'
        var hash = uri.fragment();

        var state;

        if (!hash) {
            configApi.getDefaultDashboard(function (config) {
                state = new State(config.defaultProjects, config.defaultMetrics);
                this.defaultProjects(config.defaultProjects);
                this.defaultMetrics(config.defaultMetrics);
            }.bind(this));

        } else {
            state = State.splitStateURL(hash);
            this.defaultProjects(state.projects);
            this.defaultMetrics(state.metrics);
        }

        // now define the computation for the state
        self.state = ko.computed(function () {

            var metric = ko.unwrap(self.selectedMetric),
                projects = ko.unwrap(self.selectedProjects),
                metricName, projectNames;

            if (metric || (projects && projects.length)) {
                if (metric) {
                    metricName = metric.name;
                }
                if (projects) {
                    projectNames = projects.map(function (p) {
                        // TODO: this is a hack to keep the URL from flickering
                        // The proper fix is a better state manager that behaves
                        // more predictably in the knockout data flow
                        return p.database || p;
                    });
                }

                state = new State(projectNames, metricName);


            } else {
                // user must have cleared up the dashboard
                // but has a prior state, clean it up
                state = new EmptyState();
            }
            StateManager.publish(state);
            return state;
        });

    };

    StateManager.prototype.getState = function () {
        return this.state();

    };

    /**
     * Publishes state changes to the url
     * @param State object
     **/
    StateManager.publish = function (state) {
        var fragment = state.toString();
        var uri = new URI().normalizeHash();
        //reset fragment
        uri.fragment(fragment);
        // careful, only reseting '#' to avoid reloads
        window.location.assign(uri.toString());

    };


    /**
     * Returns a state manager factory, this is is just to do lazy instantiation
     * of the state manager
     **/
    var stateManagerFactory = {
        instance: null,

        getManager: function (selectedProjects, selectedMetrics, defaultProjects, defaultMetrics) {
            if (!this.instance) {
                this.instance = new StateManager(selectedProjects, selectedMetrics, defaultProjects, defaultMetrics);
            }
            return this.instance;
        },

        /**
         * Intended for unit tests, we could not unload the module
         * and recycle the instance thus tests need to destroy it explicitily
         * hurts have to do this ... but what else?
         **/
        _destroy: function () {
            this.instance = null;
        }

    };

    return stateManagerFactory;

});
