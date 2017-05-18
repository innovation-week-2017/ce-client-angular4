
import {AddressBookWithData} from "../models/address-book.model";

export interface ICommand {

    execute(book: AddressBookWithData): void;

    undo(book: AddressBookWithData): void;

}

