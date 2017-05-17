import {AddressBook, AddressBookWithData} from "../models/address-book.model";
import {InjectionToken} from "@angular/core";
import {Http} from "@angular/http";

export interface IDataService {

    getAddressBooks(): Promise<AddressBook[]>;

    getAddressBook(id: string): Promise<AddressBookWithData>;

    deleteAddressBook(id: string): Promise<boolean>;

}
export const IDataService = new InjectionToken("IDataService");


export class MockDataService implements IDataService {
    
    getAddressBooks(): Promise<AddressBook[]> {
        console.info("Returning a resolved promise with 2 items.");
        return Promise.resolve([
            {
                id: "personal",
                name: "Personal"
            },
            {
                id: "work",
                name: "Work"
            }
        ]);
    }

    getAddressBook(id: string): Promise<AddressBookWithData> {
        return Promise.resolve({
            id: id,
            name: id,
            addresses: [
                {
                    "name" : "Eric Wittmann",
                    "address1" : "14 Lake Rd",
                    "address2" : "",
                    "country" : "USA",
                    "city" : "Newtown",
                    "state" : "CT",
                    "zip" : "06470"
                },
                {
                    "name" : "Edward Wittmann",
                    "address1" : "2207 South Shore Dr",
                    "address2" : "",
                    "country" : "USA",
                    "city" : "Erie",
                    "state" : "PA",
                    "zip" : "16505"
                },
                {
                    "name" : "Robert Luminati",
                    "address1" : "56726 Centerville Dr",
                    "address2" : "",
                    "country" : "USA",
                    "city" : "Jacksonville",
                    "state" : "FL",
                    "zip" : "39283"
                },
                {
                    "name" : "Zephyr Gantlesfargh",
                    "address1" : "19 Dristle Dr",
                    "address2" : "",
                    "country" : "USA",
                    "city" : "Hatterstown",
                    "state" : "NJ",
                    "zip" : "26305"
                }
            ].sort( (address1, address2) => { return address1.name.localeCompare(address2.name); })
        });
    }

    deleteAddressBook(id: string): Promise<boolean> {
        return Promise.resolve(true);
    }

}


function DataServiceFactory(http: Http): IDataService {
    return new MockDataService();
};


export let DataServiceProvider =
    {
        provide: IDataService,
        useFactory: DataServiceFactory,
        deps: [Http]
    };
