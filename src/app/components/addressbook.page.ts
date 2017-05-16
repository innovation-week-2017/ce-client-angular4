
import {Component, OnInit, Inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {IAuthenticationService} from "../services/auth.service";


/**
 * The Address Book Page component - shown when a single address book is chosen from the dashboard.
 */
@Component({
    moduleId: module.id,
    selector: "addressbook-page",
    templateUrl: "addressbook.page.html",
    styleUrls: ["addressbook.page.css"]
})
export class AddressBookPageComponent {

}