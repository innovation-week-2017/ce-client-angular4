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
var core_1 = require("@angular/core");
var address_model_1 = require("../models/address.model");
var model_util_1 = require("../util/model.util");
var AddressForm = (function () {
    function AddressForm() {
        this.onAddressChanged = new core_1.EventEmitter();
        this.onCanceled = new core_1.EventEmitter();
        this.onFieldFocused = new core_1.EventEmitter();
    }
    Object.defineProperty(AddressForm.prototype, "address", {
        get: function () {
            return this._address;
        },
        set: function (address) {
            this._address = address;
            this.model = this.clone(address);
        },
        enumerable: true,
        configurable: true
    });
    AddressForm.prototype.save = function () {
        this.onAddressChanged.emit(this.model);
    };
    AddressForm.prototype.reset = function () {
        this.model = this.clone(this.address);
    };
    AddressForm.prototype.cancel = function () {
        this.reset();
        this.onCanceled.emit(true);
    };
    AddressForm.prototype.clone = function (address) {
        return model_util_1.ModelUtils.clone(address);
    };
    AddressForm.prototype.isDirty = function () {
        if (this.model.name !== this.address.name) {
            return true;
        }
        if (this.model.address1 !== this.address.address1) {
            return true;
        }
        if (this.model.address2 !== this.address.address2) {
            return true;
        }
        if (this.model.city !== this.address.city) {
            return true;
        }
        if (this.model.state !== this.address.state) {
            return true;
        }
        if (this.model.zip !== this.address.zip) {
            return true;
        }
        if (this.model.country !== this.address.country) {
            return true;
        }
        return false;
    };
    AddressForm.prototype.focusOn = function (fieldName) {
        this.onFieldFocused.emit(fieldName);
    };
    AddressForm.prototype.focusAway = function (fieldName) {
        this.onFieldFocused.emit(null);
    };
    AddressForm.prototype.isParticipantSelected = function (fieldName) {
        if (this.resolver) {
            return this.resolver.isParticipantSelected(this.address, fieldName);
        }
    };
    return AddressForm;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", address_model_1.Address),
    __metadata("design:paramtypes", [address_model_1.Address])
], AddressForm.prototype, "address", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], AddressForm.prototype, "resolver", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], AddressForm.prototype, "onAddressChanged", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], AddressForm.prototype, "onCanceled", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], AddressForm.prototype, "onFieldFocused", void 0);
AddressForm = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: "address-form",
        templateUrl: "address.form.html",
        styleUrls: ["address.form.css"]
    })
], AddressForm);
exports.AddressForm = AddressForm;
//# sourceMappingURL=address.form.js.map