import { Component } from '@angular/core';

import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/toPromise";

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: "app.component.html"
})
export class AppComponent  {
}
