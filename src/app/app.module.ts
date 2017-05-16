import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppRouting} from "./app.routing";
import {DashboardPageComponent} from "./components/dashboard.page";
import {AuthenticationServiceProvider} from "./services/auth.service";
import {AddressBookPageComponent} from "./components/addressbook.page";
import {DataServiceProvider} from "./services/data.service";

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpModule, AppRouting ],
  declarations: [ AppComponent, DashboardPageComponent, AddressBookPageComponent ],
  providers:    [ AuthenticationServiceProvider, DataServiceProvider ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
