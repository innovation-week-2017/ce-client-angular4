"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var data_service_1 = require("../services/data.service");
var Filters = (function () {
    function Filters(params) {
        this.reset();
        if (params) {
            for (var key in params) {
                var value = params[key];
                this[key] = value;
            }
        }
    }
    Filters.prototype.accepts = function (address) {
        if (this.nameFilter === undefined || this.nameFilter === null || this.nameFilter === "") {
            return true;
        }
        var name = address.name.toLocaleLowerCase();
        var namef = this.nameFilter.toLocaleLowerCase();
        return name.indexOf(namef) >= 0;
    };
    Filters.prototype.reset = function () {
        this.nameFilter = "";
        this.sortDirection = "ASC";
    };
    return Filters;
}());
/**
 * The Address Book Page component - shown when a single address book is chosen from the dashboard.
 */
var AddressBookPageComponent = (function () {
    function AddressBookPageComponent(route, data) {
        this.route = route;
        this.data = data;
        this.pageLoaded = false;
        this.selectedAddress = null;
        this.filters = new Filters();
        this.participantSelections = {};
    }
    AddressBookPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.info("[AddressBookPageComponent] Init");
        this.filteredAddresses = [];
        this.route.params.subscribe(function (value) {
            var bookId = value["bookId"];
            _this.data.getAddressBook(bookId).then(function (book) {
                _this.addressBook = book;
                _this.editingSession = _this.data.editAddressBook(book.id, function () {
                    _this.pageLoaded = true;
                    _this.editingSession.participants.subscribe(function (participants) {
                        console.info("[AddressBookPageComponent] Participants now: " + participants);
                    });
                    _this.editingSession.navHandler(function (navMessage) {
                        console.info("[AddressBookPageComponent] Participant Selection Change: " + navMessage.addressName);
                        _this.participantSelections[navMessage.from] = navMessage;
                    });
                });
                _this.filter();
            });
        });
    };
    AddressBookPageComponent.prototype.ngOnDestroy = function () {
        console.info("[AddressBookPageComponent] Destroy");
        if (this.editingSession) {
            this.editingSession.close();
        }
    };
    AddressBookPageComponent.prototype.isSelected = function (address) {
        return this.selectedAddress === address;
    };
    AddressBookPageComponent.prototype.isParticipantSelected = function (address, fieldName) {
        for (var user in this.participantSelections) {
            var selection = this.participantSelections[user];
            if (selection && selection.addressName === address.name) {
                if (!fieldName) {
                    return true;
                }
                return fieldName == selection.fieldName;
            }
        }
        return false;
    };
    AddressBookPageComponent.prototype.toSummary = function (address) {
        return address.address1 + " " + address.city + ", " + address.state + " " + address.zip;
    };
    AddressBookPageComponent.prototype.filter = function () {
        var _this = this;
        // Clear the array first.
        this.filteredAddresses.splice(0, this.filteredAddresses.length);
        for (var _i = 0, _a = this.addressBook.addresses; _i < _a.length; _i++) {
            var api = _a[_i];
            if (this.filters.accepts(api)) {
                this.filteredAddresses.push(api);
            }
        }
        this.filteredAddresses.sort(function (a1, a2) {
            var rval = a1.name.localeCompare(a2.name);
            if (_this.filters.sortDirection === "DESC") {
                rval *= -1;
            }
            return rval;
        });
        if (this.filteredAddresses.indexOf(this.selectedAddress) === -1) {
            this.selectedAddress = null;
        }
        return this.filteredAddresses;
    };
    AddressBookPageComponent.prototype.toggleSortDirection = function () {
        if (this.filters.sortDirection === "ASC") {
            this.filters.sortDirection = "DESC";
        }
        else {
            this.filters.sortDirection = "ASC";
        }
        this.filter();
    };
    AddressBookPageComponent.prototype.toggleAddressSelected = function (address) {
        console.info("[AddressBookPageComponent] Toggling selection: " + address.name);
        if (this.selectedAddress === address) {
            this.selectedAddress = null;
            if (this.editingSession) {
                this.editingSession.sendNavigation(null);
            }
        }
        else {
            this.selectedAddress = address;
            if (this.editingSession) {
                this.editingSession.sendNavigation(address.name);
            }
        }
    };
    AddressBookPageComponent.prototype.clearFilters = function () {
        this.filters.nameFilter = "";
        this.filter();
    };
    AddressBookPageComponent.prototype.deleteSelectedAddresses = function () {
        var idx = this.addressBook.addresses.indexOf(this.selectedAddress);
        this.addressBook.addresses.splice(idx, 1);
        this.selectedAddress = null;
        this.filter();
    };
    AddressBookPageComponent.prototype.updateAddress = function (updatedAddress) {
        this.addressBook.addresses.forEach(function (address) {
            if (address.name === updatedAddress.name) {
                address.address1 = updatedAddress.address1;
                address.address2 = updatedAddress.address2;
                address.city = updatedAddress.city;
                address.state = updatedAddress.state;
                address.zip = updatedAddress.zip;
                address.country = updatedAddress.country;
            }
        });
    };
    AddressBookPageComponent.prototype.focusOnAddressField = function (fieldName) {
        this.editingSession.sendNavigation(this.selectedAddress.name, fieldName);
    };
    AddressBookPageComponent.prototype.resolver = function () {
        return this;
    };
    return AddressBookPageComponent;
}());
AddressBookPageComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: "addressbook-page",
        templateUrl: "addressbook.page.html",
        styleUrls: ["addressbook.page.css"]
    }),
    __param(1, core_1.Inject(data_service_1.IDataService)),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, Object])
], AddressBookPageComponent);
exports.AddressBookPageComponent = AddressBookPageComponent;
//# sourceMappingURL=addressbook.page.js.map