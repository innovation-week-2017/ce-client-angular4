import {AddressBook, AddressBookWithData} from "../models/address-book.model";
import {InjectionToken} from "@angular/core";
import {Http, RequestOptions, Headers} from "@angular/http";
import {IAuthenticationService} from "./auth.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";


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
    fieldName: string;

    constructor() {
        super();
        this.type = "nav";
    }

}

export class AddressBookEditingSession {

    private currentParticipants: string[] = [];
    private _participants: BehaviorSubject<string[]> = new BehaviorSubject([]);
    public participants: Observable<string[]> = this._participants.asObservable();
    private _navHandler: ((message: NavigationMessage) => void);

    constructor(private username: string, private socket: WebSocket, connectHandler: () => void) {
        socket.onopen = (openEvent) => {
            connectHandler();
        };
        socket.onmessage = (msgEvent) => {
            let msg: Message = this.readMessage(msgEvent.data);
            if (msg.type === "join") {
                this.currentParticipants.push(msg.from);
                this._participants.next(this.currentParticipants);
            }
            if (msg.type === "leave") {
                this.currentParticipants.splice(this.currentParticipants.indexOf(msg.from), 1);
                this._participants.next(this.currentParticipants);
            }
            if (msg.type === "nav" && this._navHandler) {
                this._navHandler(<NavigationMessage>msg);
            }
        };
        socket.onclose = (closeEvent) => {
            console.info("Detected a CLOSE event!");
        };
    }

    public navHandler(handler: (message: NavigationMessage) => void): void {
        this._navHandler = handler;
    }

    private readMessage(rawMessage: string): Message {
        let jsMessage: any = JSON.parse(rawMessage);
        if (jsMessage.type === "join") {
            return <JoinMessage>jsMessage;
        }
        if (jsMessage.type === "leave") {
            return <LeaveMessage>jsMessage;
        }
        if (jsMessage.type === "nav") {
            return <NavigationMessage>jsMessage;
        }
        throw Error("Failed to parse message: " + rawMessage);
    }

    public sendNavigation(address: string, fieldName?: string): void {
        let msg: NavigationMessage = new NavigationMessage();
        msg.from = this.username;
        msg.addressName = address;
        msg.fieldName = fieldName;
        this.socket.send(JSON.stringify(msg));
    }

    public close(): void {
        this.socket.close();
    }

}


export interface IDataService {

    getAddressBooks(): Promise<AddressBook[]>;

    getAddressBook(id: string): Promise<AddressBookWithData>;

    editAddressBook(id: string, connectHandler: () => void): AddressBookEditingSession;

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

    editAddressBook(id: string, connectHandler: () => void): AddressBookEditingSession {
        let url: string = this.endpoint("ws", "/editAddressBook/:bookId/:user", { bookId: id, user: this.authService.getAuthenticatedUser() });
        console.info("[RemoteDataService] Connecting to websocket at: " + url);
        let ws: WebSocket = new WebSocket(url);
        return new AddressBookEditingSession(this.authService.getAuthenticatedUser(), ws, connectHandler);
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

    editAddressBook(id: string, connectHandler: () => void): AddressBookEditingSession {
        return undefined;
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
