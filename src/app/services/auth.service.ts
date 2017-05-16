
import {InjectionToken} from "@angular/core";

import {Headers, Http} from "@angular/http";


export interface IAuthenticationService {

    /**
     * Get the currently authenticated user.
     */
    getAuthenticatedUser(): string;

    /**
     * Called to inject authentication headers into an API REST call.
     * @param headers
     */
    injectAuthHeaders(headers: Headers): void;
}
export const IAuthenticationService = new InjectionToken("IAuthenticationService");


export class AutoAuthenticationService implements IAuthenticationService {

    username: string;

    constructor(private http: Http) {
        this.username = "user-" + new Date().getTime();
    }

    getAuthenticatedUser(): string {
        return this.username;
    }

    injectAuthHeaders(headers: Headers): void {
        let authHeader: string;
        authHeader = "Basic " + btoa(this.username + ":" + this.username);
        headers.set("Authorization", authHeader);
    }
}


function AuthenticationServiceFactory(http: Http): IAuthenticationService {
    return new AutoAuthenticationService(http);
};


export let AuthenticationServiceProvider =
    {
        provide: IAuthenticationService,
        useFactory: AuthenticationServiceFactory,
        deps: [Http]
    };
