
import {Address} from "./address.model";

export class AddressBook {

    public id: string;
    public name: string;

}


export class AddressBookWithData extends AddressBook {

    public addresses: Address[];

}