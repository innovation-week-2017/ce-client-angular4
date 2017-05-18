"use strict";
var DeleteAddressCommand = (function () {
    function DeleteAddressCommand(name) {
        this.name = name;
    }
    DeleteAddressCommand.prototype.execute = function (book) {
        var _this = this;
        this.deleted = [];
        book.addresses.filter(function (addy) {
            return _this.name == addy.name;
        }).forEach(function (addy) {
            book.addresses.splice(book.addresses.indexOf(addy), 1);
            _this.deleted.push(addy);
        });
    };
    DeleteAddressCommand.prototype.undo = function (book) {
        this.deleted.forEach(function (addy) {
            book.addresses.push(addy);
        });
    };
    return DeleteAddressCommand;
}());
exports.DeleteAddressCommand = DeleteAddressCommand;
//# sourceMappingURL=delete.command.js.map