
import {Component, OnInit, Inject, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {IAuthenticationService} from "../services/auth.service";
import {AddressBookWithData} from "../models/address-book.model";
import {AddressBookEditingSession, CreateMessage, IDataService, NavigationMessage} from "../services/data.service";
import {Address} from "../models/address.model";
import {IParticipantSelectionResolver} from "./address.form";
import {UpdateAddressCommand} from "../commands/update.command";
import {ICommand} from "../commands/command";
import {DeleteAddressCommand} from "../commands/delete.command";
import {CreateAddressCommand} from "../commands/create.command";
import {Observable} from "rxjs/Observable";


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
export class AddressBookPageComponent implements OnInit, OnDestroy, IParticipantSelectionResolver {

    private pageLoaded: boolean = false;
    private addressBook: AddressBookWithData;
    private editingSession: AddressBookEditingSession;

    private filteredAddresses: Address[];
    private selectedAddress: Address = null;
    private filters: Filters = new Filters();

    private participantSelections: any = {};

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
                    this.editingSession.participants.subscribe( participants => {
                        console.info("[AddressBookPageComponent] Participants now: " + participants);
                    });
                    this.editingSession.navHandler( (navMessage) => {
                        console.info("[AddressBookPageComponent] Participant Selection Change: " + navMessage.addressName);
                        this.participantSelections[navMessage.from] = navMessage;
                    });
                    this.editingSession.commandHandler( (message) => {
                        console.info("[AddressBookPageComponent] Participant executed command: " + message.type);
                        if (message.type === "create") {
                            console.info("Create command: " + JSON.stringify(message));
                            let command: ICommand = new CreateAddressCommand((<any>message).address);
                            command.execute(this.addressBook);
                            this.filter();
                        }
                        if (message.type === "delete") {
                            let command: ICommand = new DeleteAddressCommand((<any>message).addressName);
                            command.execute(this.addressBook);
                            this.filter();
                        }
                        if (message.type === "update") {
                            let command: ICommand = new UpdateAddressCommand((<any>message).address);
                            command.execute(this.addressBook);
                        }
                    });
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

    public isParticipantSelected(address: Address, fieldName?: string): boolean {
        for (let user in this.participantSelections) {
            let selection: NavigationMessage = this.participantSelections[user];
            if (selection && selection.addressName === address.name) {
                if (!fieldName) {
                    return true;
                }
                return fieldName == selection.fieldName;
            }
        }
        return false;
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
        console.info("[AddressBookPageComponent] Toggling selection: " + address.name);
        if (this.selectedAddress === address) {
            this.selectedAddress = null;
            if (this.editingSession) {
                this.editingSession.sendNavigation(null);
            }
        } else {
            this.selectedAddress = address;
            if (this.editingSession) {
                this.editingSession.sendNavigation(address.name);
            }
        }
    }

    public clearFilters(): void {
        this.filters.nameFilter = "";
        this.filter();
    }

    public addAddress(): void {
        this.data.generateRandomAddress().then( address => {
            let command: ICommand = new CreateAddressCommand(address);
            command.execute(this.addressBook);
            this.editingSession.sendCreate(address);
            this.filter();
        });
    }

    public deleteSelectedAddresses(): void {
        let command: ICommand = new DeleteAddressCommand(this.selectedAddress.name);
        command.execute(this.addressBook);

        this.editingSession.sendDelete(this.selectedAddress.name);

        this.selectedAddress = null;
        this.filter();
    }

    public updateAddress(updatedAddress: Address): void {
        let command: ICommand = new UpdateAddressCommand(updatedAddress);
        command.execute(this.addressBook);

        this.editingSession.sendUpdate(updatedAddress);
    }

    public focusOnAddressField(fieldName: string): void {
        this.editingSession.sendNavigation(this.selectedAddress.name, fieldName);
    }

    public resolver(): IParticipantSelectionResolver {
        return this;
    }

    public participants(): Observable<string[]> {
        return this.editingSession.participants;
    }
}