"use strict";
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var auth_service_1 = require("./auth.service");
var ENABLE_MOCK_DATA_SERVICE = false;
exports.IDataService = new core_1.InjectionToken("IDataService");
var RemoteDataService = (function () {
    function RemoteDataService(http, authService) {
        this.http = http;
        this.authService = authService;
        this.baseEndpoint = "http://localhost:8080/ce";
        console.info("[RemoteDataService] Creating.");
    }
    RemoteDataService.prototype.endpoint = function (path, params) {
        if (params) {
            for (var key in params) {
                var value = params[key];
                path = path.replace(":" + key, value);
            }
        }
        return this.baseEndpoint + path;
    };
    RemoteDataService.prototype.getAddressBooks = function () {
        var headers = new http_1.Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        var options = new http_1.RequestOptions({
            headers: headers
        });
        return this.http.get(this.endpoint("/addressBooks"), options).map(function (response) {
            return response.json();
        }).toPromise();
    };
    RemoteDataService.prototype.getAddressBook = function (id) {
        var headers = new http_1.Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        var options = new http_1.RequestOptions({
            headers: headers
        });
        return this.http.get(this.endpoint("/addressBooks/:bookId", { bookId: id }), options).map(function (response) {
            return response.json();
        }).toPromise();
    };
    RemoteDataService.prototype.deleteAddressBook = function (id) {
        // TODO implement this!
        return Promise.resolve(true);
    };
    return RemoteDataService;
}());
exports.RemoteDataService = RemoteDataService;
var MockDataService = (function () {
    function MockDataService() {
        console.info("[MockDataService] Creating.");
    }
    MockDataService.prototype.getAddressBooks = function () {
        console.info("Returning a resolved promise with 2 items.");
        return Promise.resolve([
            {
                id: "personal",
                name: "Personal"
            },
            {
                id: "work",
                name: "Work"
            }
        ]);
    };
    MockDataService.prototype.getAddressBook = function (id) {
        return Promise.resolve({
            id: id,
            name: id,
            addresses: [
                {
                    "name": "Eric Wittmann",
                    "address1": "14 Lake Rd",
                    "address2": "",
                    "country": "USA",
                    "city": "Newtown",
                    "state": "CT",
                    "zip": "06470"
                },
                {
                    "name": "Edward Wittmann",
                    "address1": "2207 South Shore Dr",
                    "address2": "",
                    "country": "USA",
                    "city": "Erie",
                    "state": "PA",
                    "zip": "16505"
                },
                {
                    "name": "Robert Luminati",
                    "address1": "56726 Centerville Dr",
                    "address2": "",
                    "country": "USA",
                    "city": "Jacksonville",
                    "state": "FL",
                    "zip": "39283"
                },
                {
                    "name": "Zephyr Gantlesfargh",
                    "address1": "19 Dristle Dr",
                    "address2": "",
                    "country": "USA",
                    "city": "Hatterstown",
                    "state": "NJ",
                    "zip": "26305"
                }
            ].sort(function (address1, address2) { return address1.name.localeCompare(address2.name); })
        });
    };
    MockDataService.prototype.deleteAddressBook = function (id) {
        return Promise.resolve(true);
    };
    return MockDataService;
}());
exports.MockDataService = MockDataService;
function DataServiceFactory(http, authService) {
    if (ENABLE_MOCK_DATA_SERVICE) {
        return new MockDataService();
    }
    else {
        return new RemoteDataService(http, authService);
    }
}
;
exports.DataServiceProvider = {
    provide: exports.IDataService,
    useFactory: DataServiceFactory,
    deps: [http_1.Http, auth_service_1.IAuthenticationService]
};
//# sourceMappingURL=data.service.js.map