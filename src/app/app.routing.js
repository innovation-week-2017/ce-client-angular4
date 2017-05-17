"use strict";
var router_1 = require("@angular/router");
var dashboard_page_1 = require("./components/dashboard.page");
var addressbook_page_1 = require("./components/addressbook.page");
var _appRoutes = [
    {
        path: "",
        component: dashboard_page_1.DashboardPageComponent
    },
    {
        path: "books/:bookId",
        component: addressbook_page_1.AddressBookPageComponent
    }
];
var appRoutes = _appRoutes.map(function (item) {
    return item;
});
exports.AppRouting = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map