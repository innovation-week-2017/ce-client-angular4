"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var auth_service_1 = require("./auth.service");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var ENABLE_MOCK_DATA_SERVICE = false;
var Message = (function () {
    function Message() {
    }
    return Message;
}());
exports.Message = Message;
var JoinMessage = (function (_super) {
    __extends(JoinMessage, _super);
    function JoinMessage() {
        var _this = _super.call(this) || this;
        _this.type = "join";
        return _this;
    }
    return JoinMessage;
}(Message));
exports.JoinMessage = JoinMessage;
var LeaveMessage = (function (_super) {
    __extends(LeaveMessage, _super);
    function LeaveMessage() {
        var _this = _super.call(this) || this;
        _this.type = "join";
        return _this;
    }
    return LeaveMessage;
}(Message));
exports.LeaveMessage = LeaveMessage;
var NavigationMessage = (function (_super) {
    __extends(NavigationMessage, _super);
    function NavigationMessage() {
        var _this = _super.call(this) || this;
        _this.type = "nav";
        return _this;
    }
    return NavigationMessage;
}(Message));
exports.NavigationMessage = NavigationMessage;
var AddressBookEditingSession = (function () {
    function AddressBookEditingSession(username, socket, connectHandler) {
        var _this = this;
        this.username = username;
        this.socket = socket;
        this.currentParticipants = [];
        this._participants = new BehaviorSubject_1.BehaviorSubject([]);
        this.participants = this._participants.asObservable();
        socket.onopen = function (openEvent) {
            connectHandler();
        };
        socket.onmessage = function (msgEvent) {
            var msg = _this.readMessage(msgEvent.data);
            if (msg.type === "join") {
                _this.currentParticipants.push(msg.from);
                _this._participants.next(_this.currentParticipants);
            }
            if (msg.type === "leave") {
                _this.currentParticipants.splice(_this.currentParticipants.indexOf(msg.from), 1);
                _this._participants.next(_this.currentParticipants);
            }
            if (msg.type === "nav" && _this._navHandler) {
                _this._navHandler(msg);
            }
        };
        socket.onclose = function (closeEvent) {
            console.info("Detected a CLOSE event!");
        };
    }
    AddressBookEditingSession.prototype.navHandler = function (handler) {
        this._navHandler = handler;
    };
    AddressBookEditingSession.prototype.readMessage = function (rawMessage) {
        var jsMessage = JSON.parse(rawMessage);
        if (jsMessage.type === "join") {
            return jsMessage;
        }
        if (jsMessage.type === "leave") {
            return jsMessage;
        }
        if (jsMessage.type === "nav") {
            return jsMessage;
        }
        throw Error("Failed to parse message: " + rawMessage);
    };
    AddressBookEditingSession.prototype.sendNavigation = function (address, fieldName) {
        var msg = new NavigationMessage();
        msg.from = this.username;
        msg.addressName = address;
        msg.fieldName = fieldName;
        this.socket.send(JSON.stringify(msg));
    };
    AddressBookEditingSession.prototype.close = function () {
        this.socket.close();
    };
    return AddressBookEditingSession;
}());
exports.AddressBookEditingSession = AddressBookEditingSession;
exports.IDataService = new core_1.InjectionToken("IDataService");
var RemoteDataService = (function () {
    function RemoteDataService(http, authService) {
        this.http = http;
        this.authService = authService;
        this.baseEndpoint = "localhost:8080/ce";
        console.info("[RemoteDataService] Creating.");
    }
    RemoteDataService.prototype.endpoint = function (scheme, path, params) {
        if (params) {
            for (var key in params) {
                var value = params[key];
                path = path.replace(":" + key, value);
            }
        }
        return scheme + "://" + this.baseEndpoint + path;
    };
    RemoteDataService.prototype.getAddressBooks = function () {
        var headers = new http_1.Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        var options = new http_1.RequestOptions({
            headers: headers
        });
        return this.http.get(this.endpoint("http", "/addressBooks"), options).map(function (response) {
            return response.json();
        }).toPromise();
    };
    RemoteDataService.prototype.getAddressBook = function (id) {
        var headers = new http_1.Headers({ "Accept": "application/json" });
        this.authService.injectAuthHeaders(headers);
        var options = new http_1.RequestOptions({
            headers: headers
        });
        return this.http.get(this.endpoint("http", "/addressBooks/:bookId", { bookId: id }), options).map(function (response) {
            return response.json();
        }).toPromise();
    };
    RemoteDataService.prototype.deleteAddressBook = function (id) {
        // TODO implement this!
        return Promise.resolve(true);
    };
    RemoteDataService.prototype.editAddressBook = function (id, connectHandler) {
        var url = this.endpoint("ws", "/editAddressBook/:bookId/:user", { bookId: id, user: this.authService.getAuthenticatedUser() });
        console.info("[RemoteDataService] Connecting to websocket at: " + url);
        var ws = new WebSocket(url);
        return new AddressBookEditingSession(this.authService.getAuthenticatedUser(), ws, connectHandler);
    };
    return RemoteDataService;
}());
exports.RemoteDataService = RemoteDataService;
var MockDataService = (function () {
    function MockDataService() {
        console.info("[MockDataService] Creating.");
    }
    MockDataService.prototype.getAddressBooks = function () {
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
    };
    MockDataService.prototype.getAddressBook = function (id) {
        return Promise.resolve({
            id: id,
            name: id,
            addresses: [
                {
                    "name": "Eric Wittmann",
                    "address1": "14 Lake Rd",
                    "address2": "",
                    "country": "USA",
                    "city": "Newtown",
                    "state": "CT",
                    "zip": "06470"
                },
                {
                    "name": "Edward Wittmann",
                    "address1": "2207 South Shore Dr",
                    "address2": "",
                    "country": "USA",
                    "city": "Erie",
                    "state": "PA",
                    "zip": "16505"
                },
                {
                    "name": "Robert Luminati",
                    "address1": "56726 Centerville Dr",
                    "address2": "",
                    "country": "USA",
                    "city": "Jacksonville",
                    "state": "FL",
                    "zip": "39283"
                },
                {
                    "name": "Zephyr Gantlesfargh",
                    "address1": "19 Dristle Dr",
                    "address2": "",
                    "country": "USA",
                    "city": "Hatterstown",
                    "state": "NJ",
                    "zip": "26305"
                }
            ].sort(function (address1, address2) { return address1.name.localeCompare(address2.name); })
        });
    };
    MockDataService.prototype.deleteAddressBook = function (id) {
        return Promise.resolve(true);
    };
    MockDataService.prototype.editAddressBook = function (id, connectHandler) {
        return undefined;
    };
    return MockDataService;
}());
exports.MockDataService = MockDataService;
function DataServiceFactory(http, authService) {
    if (ENABLE_MOCK_DATA_SERVICE) {
        return new MockDataService();
    }
    else {
        return new RemoteDataService(http, authService);
    }
}
;
exports.DataServiceProvider = {
    provide: exports.IDataService,
    useFactory: DataServiceFactory,
    deps: [http_1.Http, auth_service_1.IAuthenticationService]
};
//# sourceMappingURL=data.service.js.map