"use strict";
var CreateAddressCommand = (function () {
    function CreateAddressCommand(address) {
        this.address = address;
    }
    CreateAddressCommand.prototype.execute = function (book) {
        book.addresses.push(this.address);
    };
    CreateAddressCommand.prototype.undo = function (book) {
        var _this = this;
        book.addresses.filter(function (addy) {
            return addy.name == _this.address.name;
        }).forEach(function (addy) {
            book.addresses.splice(book.addresses.indexOf(addy), 1);
        });
    };
    return CreateAddressCommand;
}());
exports.CreateAddressCommand = CreateAddressCommand;
//# sourceMappingURL=create.command.js.map