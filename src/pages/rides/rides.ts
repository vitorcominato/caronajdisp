import { Component } from '@angular/core';
import { NavController, SegmentButton, LoadingController } from 'ionic-angular';
import 'rxjs/Rx';

import { RidesModel } from './rides.model';
import { RidesService } from './rides.service';

@Component({
  selector: 'rides-page',
  templateUrl: 'rides.html'
})
export class RidesPage {
  segment: string;
  schedule: RidesModel = new RidesModel();
  loading: any;

  constructor(
    public nav: NavController,
    public ridesService: RidesService,
    public loadingCtrl: LoadingController
  ) {
    this.segment = "today";
    this.loading = this.loadingCtrl.create();
  }

  ionViewDidLoad() {
    this.loading.present();
    this.ridesService
      .getData()
      .then(data => {
        this.schedule.today = data.today;
        this.schedule.upcoming = data.upcoming;
        this.loading.dismiss();
      });
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }

}
