define(function(require) {

    var CopyParams = require('app/common-viewmodels/copy-params'),
        templateMarkup = require('text!./rickshaw-timeseries.html');

    require('./bindings');
    require('./rickshaw-extensions');

    return {
        viewModel: CopyParams,
        template: templateMarkup
    };
});
