
import {Component, OnInit, Inject, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {IAuthenticationService} from "../services/auth.service";
import {AddressBookWithData} from "../models/address-book.model";
import {AddressBookEditingSession, IDataService} from "../services/data.service";
import {Address} from "../models/address.model";


class Filters {
    nameFilter: string;
    sortDirection: string;

    constructor(params?: any) {
        this.reset();
        if (params) {
            for (let key in params) {
                let value: string = params[key];
                this[key] = value;
            }
        }
    }

    public accepts(address:Address): boolean {
        if (this.nameFilter === undefined || this.nameFilter === null || this.nameFilter === "") {
            return true;
        }
        let name: string = address.name.toLocaleLowerCase();
        let namef: string = this.nameFilter.toLocaleLowerCase();
        return name.indexOf(namef) >= 0;
    }

    public reset(): void {
        this.nameFilter = "";
        this.sortDirection = "ASC";
    }
}



/**
 * The Address Book Page component - shown when a single address book is chosen from the dashboard.
 */
@Component({
    moduleId: module.id,
    selector: "addressbook-page",
    templateUrl: "addressbook.page.html",
    styleUrls: ["addressbook.page.css"]
})
export class AddressBookPageComponent implements OnInit, OnDestroy {

    private pageLoaded: boolean = false;
    private addressBook: AddressBookWithData;
    private editingSession: AddressBookEditingSession;

    private filteredAddresses: Address[];
    private selectedAddress: Address = null;
    private filters: Filters = new Filters();

    constructor(private route: ActivatedRoute, @Inject(IDataService) private data: IDataService) {
    }

    public ngOnInit(): void {
        console.info("[AddressBookPageComponent] Init");
        this.filteredAddresses = [];
        this.route.params.subscribe(value => {
            let bookId: string = value["bookId"];
            this.data.getAddressBook(bookId).then( book => {
                this.addressBook = book;
                this.editingSession = this.data.editAddressBook(book.id, () => {
                    this.pageLoaded = true;
                }, message => {
                    console.info("[AddressBookPageComponent] Received message: " + message.type);
                });
                this.filter();
            });
        });
    }

    public ngOnDestroy(): void {
        console.info("[AddressBookPageComponent] Destroy");
        if (this.editingSession) {
            this.editingSession.close();
        }
    }

    public isSelected(address: Address): boolean {
        return this.selectedAddress === address;
    }

    public toSummary(address: Address): string {
        return address.address1 + " " + address.city + ", " + address.state + " " + address.zip;
    }

    private filter(): Address[] {
        // Clear the array first.
        this.filteredAddresses.splice(0, this.filteredAddresses.length);
        for (let api of this.addressBook.addresses) {
            if (this.filters.accepts(api)) {
                this.filteredAddresses.push(api);
            }
        }
        this.filteredAddresses.sort( (a1:Address, a2:Address) => {
            let rval: number = a1.name.localeCompare(a2.name);
            if (this.filters.sortDirection === "DESC") {
                rval *= -1;
            }
            return rval;
        });

        if (this.filteredAddresses.indexOf(this.selectedAddress) === -1) {
            this.selectedAddress = null;
        }

        return this.filteredAddresses;
    }

    public toggleSortDirection(): void {
        if (this.filters.sortDirection === "ASC") {
            this.filters.sortDirection = "DESC";
        } else {
            this.filters.sortDirection = "ASC";
        }
        this.filter();
    }

    public toggleAddressSelected(address: Address): void {
        if (this.selectedAddress === address) {
            this.selectedAddress = null;
        } else {
            this.selectedAddress = address;
        }
    }

    public clearFilters(): void {
        this.filters.nameFilter = "";
        this.filter();
    }

    public deleteSelectedAddresses(): void {
        let idx: number = this.addressBook.addresses.indexOf(this.selectedAddress);
        this.addressBook.addresses.splice(idx, 1);
        this.selectedAddress = null;
        this.filter();
    }

    public updateAddress(updatedAddress: Address): void {
        this.addressBook.addresses.forEach( address => {
            if (address.name === updatedAddress.name) {
                address.address1 = updatedAddress.address1;
                address.address2 = updatedAddress.address2;
                address.city = updatedAddress.city;
                address.state = updatedAddress.state;
                address.zip = updatedAddress.zip;
                address.country = updatedAddress.country;
            }
        });
    }
}