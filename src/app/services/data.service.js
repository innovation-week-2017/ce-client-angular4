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