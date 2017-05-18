"use strict";
var model_util_1 = require("../util/model.util");
var UpdateAddressCommand = (function () {
    function UpdateAddressCommand(address) {
        this.address = address;
    }
    UpdateAddressCommand.prototype.execute = function (book) {
        var _this = this;
        var addressToUpdate = book.addresses.filter(function (addy) {
            return addy.name == _this.address.name;
        })[0];
        this._oldAddress = model_util_1.ModelUtils.clone(addressToUpdate);
        this.copyTo(addressToUpdate, this.address);
    };
    UpdateAddressCommand.prototype.undo = function (book) {
        var _this = this;
        var addressToUpdate = book.addresses.filter(function (addy) {
            return addy.name == _this.address.name;
        })[0];
        this.copyTo(addressToUpdate, this._oldAddress);
    };
    UpdateAddressCommand.prototype.copyTo = function (to, from) {
        to.address1 = from.address1;
        to.address2 = from.address2;
        to.city = from.city;
        to.state = from.state;
        to.zip = from.zip;
        to.country = from.country;
    };
    return UpdateAddressCommand;
}());
exports.UpdateAddressCommand = UpdateAddressCommand;
//# sourceMappingURL=update.command.js.map