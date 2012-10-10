function HTTPryRequest(oHttp) {
    this.init(oHttp);
}

HTTPryRequest.prototype = {

    oHttp : null,

    headers : {},

    init : function(oHttp) {
        this.oHttp = oHttp;

        // the callback can't deal with 'this', so we have to use the regular hack to cope
        oHttp.visitRequestHeaders((function(request) { return function(header, value) {
            request.headers[header] = value;
        }})(this));

    }

};
