import {ICommand} from "./command";
import {AddressBookWithData} from "../models/address-book.model";
import {Address} from "../models/address.model";

export class DeleteAddressCommand implements ICommand {

    private deleted: Address[];

    constructor(private name: string) {}

    execute(book: AddressBookWithData): void {
        this.deleted = [];
        book.addresses.filter( addy => {
            return this.name == addy.name;
        }).forEach( addy => {
            book.addresses.splice(book.addresses.indexOf(addy), 1);
            this.deleted.push(addy);
        });
    }

    undo(book: AddressBookWithData): void {
        this.deleted.forEach( addy => {
            book.addresses.push(addy);
        });
    }

}
