"use strict";
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
exports.IAuthenticationService = new core_1.InjectionToken("IAuthenticationService");
var AutoAuthenticationService = (function () {
    function AutoAuthenticationService(http) {
        this.http = http;
        this.username = "user-" + new Date().getTime();
    }
    AutoAuthenticationService.prototype.getAuthenticatedUser = function () {
        return this.username;
    };
    AutoAuthenticationService.prototype.injectAuthHeaders = function (headers) {
        var authHeader;
        authHeader = "Basic " + btoa(this.username + ":" + this.username);
        headers.set("Authorization", authHeader);
    };
    return AutoAuthenticationService;
}());
exports.AutoAuthenticationService = AutoAuthenticationService;
function AuthenticationServiceFactory(http) {
    return new AutoAuthenticationService(http);
}
;
exports.AuthenticationServiceProvider = {
    provide: exports.IAuthenticationService,
    useFactory: AuthenticationServiceFactory,
    deps: [http_1.Http]
};
//# sourceMappingURL=auth.service.js.map