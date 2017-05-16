
import {Component, OnInit, Inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {IDataService} from "../services/data.service";
import {AddressBook} from "../models/address-book.model";


/**
 * The Dashboard Page component - models the logical root path of the application.
 */
@Component({
    moduleId: module.id,
    selector: "dashboard-page",
    templateUrl: "dashboard.page.html",
    styleUrls: ["dashboard.page.css"]
})
export class DashboardPageComponent {

    books: Promise<AddressBook[]>;

    constructor(private route: ActivatedRoute, @Inject(IDataService) private dataService: IDataService) {
        this.books = dataService.getAddressBooks();
    }

    addressBooks(): Promise<AddressBook[]> {
        console.info("Getting address books.");
        return this.books;
    }

}