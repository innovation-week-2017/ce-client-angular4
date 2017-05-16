
import {Component, OnInit, Inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {IAuthenticationService} from "../services/auth.service";


/**
 * The Dashboard Page component - models the logical root path of the application.
 */
@Component({
    moduleId: module.id,
    selector: "dashboard-page",
    templateUrl: "dashboard.page.html",
    styleUrls: ["dashboard.page.css"]
})
export class DashboardPageComponent implements OnInit {

    constructor(private route: ActivatedRoute, @Inject(IAuthenticationService) private authService: IAuthenticationService) {
    }

    ngOnInit(): void {
    }

}