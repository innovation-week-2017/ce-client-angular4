"use strict";
var address_model_1 = require("../models/address.model");
var ModelUtils = (function () {
    function ModelUtils() {
    }
    ModelUtils.clone = function (address) {
        var rval = new address_model_1.Address();
        rval.name = address.name;
        rval.address1 = address.address1;
        rval.address2 = address.address2;
        rval.city = address.city;
        rval.state = address.state;
        rval.zip = address.zip;
        rval.country = address.country;
        return rval;
    };
    return ModelUtils;
}());
exports.ModelUtils = ModelUtils;
//# sourceMappingURL=model.util.js.map