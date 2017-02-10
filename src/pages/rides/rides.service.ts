import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { RidesModel } from './rides.model';

@Injectable()
export class RidesService {
  constructor(public http: Http) {}

  getData(): Promise<RidesModel> {
    return this.http.get('./assets/example_data/schedule.json')
     .toPromise()
     .then(response => response.json() as RidesModel)
     .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}