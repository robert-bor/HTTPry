
var httpryObserver;
var $;

function startObserving() {
    httpryObserver = new HTTPryObserver();
    httpryObserver.start();
    httpryObserver.jquery = httpryObserver.loadjQuery(window);
    $ = httpryObserver.jquery;
}

function stopObserving() {
    httpryObserver.stop();
    delete httpryObserver;
    httpryObserver = null;
}

function HTTPryObserver() {}

HTTPryObserver.prototype = {

    jquery : null,

    start : function() {
        this.addObservers();
    },

    stop : function() {
        this.removeObservers();
    },

    loadjQuery: function(wnd){
        var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
        loader.loadSubScript("chrome://httpry/content/jquery-xul.js",wnd);
        return wnd.jQuery.noConflict(true);
    },

    observe: function(aSubject, aTopic, aData) {
        if (aTopic == 'http-on-modify-request') {
            aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);
            this.onModifyRequest(new HTTPryRequest(aSubject));
        } else if (aTopic == 'http-on-examine-response') {
            aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);
            this.onExamineResponse(new HTTPryRequest(aSubject));
        }
    },

    QueryInterface: function(iid) {
        if (!iid.equals(Components.interfaces.nsISupports) &&
                !iid.equals(Components.interfaces.nsIHttpNotify) &&
                !iid.equals(Components.interfaces.nsIObserver)) {
            throw Components.results.NS_ERROR_NO_INTERFACE;
        }
        return this;
    },

    onModifyRequest : function (request) {

        console.log(request.oHttp.requestMethod+" "+request.oHttp.URI.asciiSpec);
        this.addToPriedRequests(request);

        for (var header in request.headers) {
            console.log("  "+header+"="+request.headers[header]);
        }
    },

    onExamineResponse : function (request) {
    },

    addObservers : function() {
        var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
        observerService.addObserver(this, "http-on-modify-request",   false);
        observerService.addObserver(this, "http-on-examine-response", false);
    },

    removeObservers : function() {
        var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
        observerService.removeObserver(this, "http-on-examine-response");
        observerService.removeObserver(this, "http-on-modify-request");
    },

    addToPriedRequests : function(request) {
        var treeItem = document.createElement('treeitem');
        var treeRow = document.createElement('treerow');

        treeRow.appendChild(this.createCell(request.oHttp.requestMethod));
        treeRow.appendChild(this.createCell(request.oHttp.URI.asciiSpec));

        treeItem.appendChild(treeRow);
        $('#priedRequests').append(treeItem);
    },

    createCell : function (value) {
        var treeCell = document.createElement('treecell');
        treeCell.setAttribute('label', value);
        return treeCell;
    }

};
