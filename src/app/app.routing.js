"use strict";
var router_1 = require("@angular/router");
var dashboard_page_1 = require("./components/dashboard.page");
var _appRoutes = [
    {
        path: "",
        component: dashboard_page_1.DashboardPageComponent
    }
];
var appRoutes = _appRoutes.map(function (item) {
    return item;
});
exports.AppRouting = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map