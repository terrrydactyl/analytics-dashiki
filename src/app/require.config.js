/* jshint -W098 */
/* jshint -W079 */
'use strict';
// require.js looks for the following global when initializing
var require = {
    baseUrl: '.',
    paths: {
        'jquery'                : 'bower_modules/jquery/dist/jquery',
        // NOTE: the minified ko build is broken in 3.2.0
        // (Issue reported https://github.com/knockout/knockout/issues/1528)
        'knockout'              : 'bower_modules/knockout/dist/knockout.debug',
        'knockout-projections'  : 'bower_modules/knockout-projections/dist/knockout-projections',
        'text'                  : 'bower_modules/requirejs-text/text',
        'd3'                    : 'bower_modules/d3/d3',
        'vega'                  : 'bower_modules/vega/vega',
        'topojson'              : 'bower_modules/topojson/topojson',
        'moment'                : 'bower_modules/moment/moment',
        'semantic-dropdown'     : 'bower_modules/semantic/build/uncompressed/modules/dropdown',
        'semantic-popup'        : 'bower_modules/semantic/build/uncompressed/modules/popup',
        'mediawiki-storage'     : 'bower_modules/mediawiki-storage/dist/mediawiki-storage',
        'marked'                : 'bower_modules/marked/lib/marked',
        'twix'                  : 'bower_modules/twix/bin/twix',
        // NOTE: if you want functions like uri.expand, you must include both
        // URI and URITemplate like define(['uri/URI', 'uri/URITemplate'] ...
        // because URITemplate modifies URI when it's parsed
        'uri'                   : 'bower_modules/URIjs/src',
        'config'                : 'app/config',
        'logger'                : 'lib/logger',
        'wikimetricsApi'        : 'app/apis/wikimetrics',
        'annotationsApi'        : 'app/apis/annotations-api',
        'pageviewApi'           : 'app/apis/legacy-pageview-api',
        'configApi'             : 'app/apis/config-api',
        'dataConverterFactory'  : 'app/data-converters/factory',
        'typeahead'             : 'bower_modules/typeahead.js/dist/typeahead.bundle',
        'ajaxWrapper'           : 'lib/ajax-wrapper',
        'utils'                 : 'lib/utils',
        'window'                : 'lib/window',
        'stateManager'          : 'lib/state-manager'
    },
    shim: {
        'ajaxWrapper': {
            //These script dependencies should be loaded before loading
            //ajaxWrapper.js
            deps: ['jquery']
        },
        'typeahead': {
            //These script dependencies should be loaded before loading
            //typeahead
            deps: ['jquery']
        }
    }

};
