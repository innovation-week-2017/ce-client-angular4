
import {Routes, RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {DashboardPageComponent} from "./components/dashboard.page";


const _appRoutes: any[] = [
    {
        path: "",
        component: DashboardPageComponent
    }
];

const appRoutes: Routes = _appRoutes.map(item => {
    return item;
});

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
