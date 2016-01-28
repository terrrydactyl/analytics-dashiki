define(function (require) {
    'use strict';

    var ko = require('knockout'),
        _ = require('lodash'),
        templateMarkup = require('text!./tabs-layout.html'),
        configApi = require('apis.config');

    require('twix');

    function isGraph(g) {
        return g && g.id && g.title;
    }

    function TabsLayout() {

        this.config = ko.observable({});
        this.selectedTab = ko.observable({});
        this.selectedGraph = ko.observable(null);

        this.select = function (tab, graph) {
            location.hash = tab.id;
            if (isGraph(graph) && !graph.selected()) {
                location.hash += '/' + graph.id;
                this.selectedGraph(graph);
                // TODO: hack - take this out into a binding
                $('.scrollable').scrollTop(0);
            } else {
                this.selectedGraph(null);
            }
            this.selectedTab(tab);
        }.bind(this);

        configApi.getDefaultDashboard(function (config) {
            config.tabs.forEach(function (t) {
                var dashboard = this;

                t.id = _.kebabCase(t.title);
                t.select = dashboard.select;
                t.selected = ko.computed(function () {
                    return t === dashboard.selectedTab();
                });

                t.graphs.forEach(function (g) {
                    g.id = _.kebabCase(g.title);
                    g.select = function () { dashboard.select(t, g); };
                    g.selected = ko.computed(function () {
                        return g === dashboard.selectedGraph();
                    });
                });
            }, this);

            if (config.tabs.length > 0) {
                var tabId = config.tabs[0].id,
                    graphId, tab, graph;

                if (location.hash) {
                    var selectIds = location.hash.substr(1).split('/');
                    tabId = selectIds[0];
                    graphId = selectIds[1];
                }
                tab = _.find(config.tabs, function (t) { return t.id === tabId; });
                if (graphId) {
                    graph = _.find(tab.graphs, function (g) { return g.id === graphId; });
                }
                this.select(tab, graph);
            }
            this.config(config);

        }.bind(this), 'tabs');
    }

    return {
        viewModel: TabsLayout,
        template: templateMarkup,
        dispose: function () {
            return;
        }
    };
});
