import {RouterModule, Routes} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {DashboardPageComponent} from "./components/dashboard.page";
import {AddressBookPageComponent} from "./components/addressbook.page";


const _appRoutes: any[] = [
    {
        path: "",
        component: DashboardPageComponent
    },
    {
        path: "books/:bookId",
        component: AddressBookPageComponent
    }
];

const appRoutes: Routes = _appRoutes.map(item => {
    return item;
});

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
