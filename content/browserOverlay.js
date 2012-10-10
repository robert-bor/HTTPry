if ("undefined" == typeof(HTTPryChrome)) {
    var HTTPryChrome = {};
};

HTTPryChrome.BrowserOverlay = {
    openHTTPry : function(aEvent) {
        toOpenWindowByType('global:HTTPry', 'chrome://httpry/content/httpry_main.xul');
    }
};
