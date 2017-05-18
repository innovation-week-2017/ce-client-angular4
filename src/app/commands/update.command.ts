import {ICommand} from "./command";
import {AddressBookWithData} from "../models/address-book.model";
import {Address} from "../models/address.model";
import {ModelUtils} from "../util/model.util";

export class UpdateAddressCommand implements ICommand {

    private _oldAddress: Address;

    constructor(private address: Address) {}

    execute(book: AddressBookWithData): void {
        let addressToUpdate: Address = book.addresses.filter( addy => {
            return addy.name == this.address.name;
        })[0];
        this._oldAddress = ModelUtils.clone(addressToUpdate);
        this.copyTo(addressToUpdate, this.address);
    }

    undo(book: AddressBookWithData): void {
        let addressToUpdate: Address = book.addresses.filter( addy => {
            return addy.name == this.address.name;
        })[0];
        this.copyTo(addressToUpdate, this._oldAddress);
    }

    private copyTo(to: Address, from: Address): void {
        to.address1 = from.address1;
        to.address2 = from.address2;
        to.city = from.city;
        to.state = from.state;
        to.zip = from.zip;
        to.country = from.country;
    }

}
