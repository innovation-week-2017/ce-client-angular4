"use strict";
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
exports.IDataService = new core_1.InjectionToken("IDataService");
var MockDataService = (function () {
    function MockDataService() {
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
                }
            ]
        });
    };
    MockDataService.prototype.deleteAddressBook = function (id) {
        return Promise.resolve(true);
    };
    return MockDataService;
}());
exports.MockDataService = MockDataService;
function DataServiceFactory(http) {
    return new MockDataService();
}
;
exports.DataServiceProvider = {
    provide: exports.IDataService,
    useFactory: DataServiceFactory,
    deps: [http_1.Http]
};
//# sourceMappingURL=data.service.js.map