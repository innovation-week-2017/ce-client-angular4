import {AddressBook, AddressBookWithData} from "../models/address-book.model";
import {InjectionToken} from "@angular/core";
import {Http, RequestOptions, Headers} from "@angular/http";
import {IAuthenticationService} from "./auth.service";


var ENABLE_MOCK_DATA_SERVICE = false;

export class Message {
    from: string;
    type: string;
}

export class JoinMessage extends Message {

    constructor() {
        super();
        this.type = "join";
    }

}

export class LeaveMessage extends Message {

    constructor() {
        super();
        this.type = "join";
    }

}

export class NavigationMessage extends Message {

    addressName: string;

    constructor() {
        super();
        this.type = "nav";
    }

}

export class AddressBookEditingSession {

    constructor(private socket: WebSocket, connectHandler: () => void, messageHandler: (message: Message) => void) {
        socket.onopen = (openEvent) => {
            connectHandler();
        };
        socket.onmessage = (msgEvent) => {
            let msg: Message = this.readMessage(msgEvent.data);
            messageHandler(msg);
        };
        socket.onclose = (closeEvent) => {
            console.info("Detected a CLOSE event!");
        };
    }

    private readMessage(rawMessage: string): Message {
        let jsMessage: any = JSON.parse(rawMessage);
        if (jsMessage.type === "join") {
            return <JoinMessage>jsMessage;
        }
        if (jsMessage.type === "leave") {
            return <LeaveMessage>jsMessage;
        }
        if (jsMessage.type === "navigation") {
            return <NavigationMessage>jsMessage;
        }
        throw Error("Failed to parse message: " + rawMessage);
    }

    public close(): void {
        this.socket.close();
    }

}


export interface IDataService {

    getAddressBooks(): Promise<AddressBook[]>;

    getAddressBook(id: string): Promise<AddressBookWithData>;

    editAddressBook(id: string, connectHandler: ()=>void, messageHandler: (message: Message)=>void): AddressBookEditingSession;

    deleteAddressBook(id: string): Promise<boolean>;

}
export const IDataService = new InjectionToken("IDataService");


export class RemoteDataService implements IDataService {

    private baseEndpoint: string = "localhost:8080/ce";

    constructor(private http: Http, private authService: IAuthenticationService) {
        console.info("[RemoteDataService] Creating.");
    }

    private endpoint(scheme: string, path: string, params?: any): string {
        if (params) {
            for (let key in params) {
                let value: string = params[key];
                path = path.replace(":" + key, value);
            }
        }
        return scheme + "://" + this.baseEndpoint + path;
    }

    getAddressBooks(): Promise<AddressBook[]> {
        let headers: Headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });
        return this.http.get(this.endpoint("http", "/addressBooks"), options).map( response => {
            return <AddressBook[]>response.json();
        }).toPromise();
    }

    getAddressBook(id: string): Promise<AddressBookWithData> {
        let headers: Headers = new Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        let options = new RequestOptions({
            headers: headers
        });
        return this.http.get(this.endpoint("http", "/addressBooks/:bookId", { bookId: id }), options).map( response => {
            return <AddressBookWithData>response.json();
        }).toPromise();
    }

    deleteAddressBook(id: string): Promise<boolean> {
        // TODO implement this!
        return Promise.resolve(true);
    }

    editAddressBook(id: string, connectHandler: () => void, messageHandler: (message: Message) => void): AddressBookEditingSession {
        let url: string = this.endpoint("ws", "/editAddressBook/:bookId/:user", { bookId: id, user: this.authService.getAuthenticatedUser() });
        console.info("[RemoteDataService] Connecting to websocket at: " + url);
        let ws: WebSocket = new WebSocket(url);
        return new AddressBookEditingSession(ws, connectHandler, messageHandler);
    }

}


export class MockDataService implements IDataService {

    constructor() {
        console.info("[MockDataService] Creating.");
    }
    
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

    editAddressBook(id: string): AddressBookEditingSession {
        // TODO do something more appropriate here!
        return null;
    }

}


function DataServiceFactory(http: Http, authService: IAuthenticationService): IDataService {
    if (ENABLE_MOCK_DATA_SERVICE) {
        return new MockDataService();
    } else {
        return new RemoteDataService(http, authService);
    }
};


export let DataServiceProvider =
    {
        provide: IDataService,
        useFactory: DataServiceFactory,
        deps: [Http, IAuthenticationService]
    };
