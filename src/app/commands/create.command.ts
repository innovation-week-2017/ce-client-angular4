import {ICommand} from "./command";
import {AddressBookWithData} from "../models/address-book.model";
import {Address} from "../models/address.model";

export class CreateAddressCommand implements ICommand {

    constructor(private address: Address) {}

    execute(book: AddressBookWithData): void {
        book.addresses.push(this.address);
    }

    undo(book: AddressBookWithData): void {
        book.addresses.filter( addy => {
            return addy.name == this.address.name;
        }).forEach( addy => {
            book.addresses.splice(book.addresses.indexOf(addy), 1);
        });
    }

}
