import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { RidesPage } from '../rides/rides';
import 'rxjs/Rx';

import { ListingModel } from './listing.model';
import { ListingService } from './listing.service';


@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html',
})
export class ListingPage {
  listing: ListingModel = new ListingModel();
  loading: any;

  constructor(
    public nav: NavController,
    public listingService: ListingService,
    public loadingCtrl: LoadingController
  ) {
    this.loading = this.loadingCtrl.create();
  }


  ionViewDidLoad() {
    this.loading.present();
    this.listingService
      .getData()
      .then(data => {
        this.listing.banner_image = data.banner_image;
        this.listing.banner_title = data.banner_title;
        this.listing.populars = data.populars;
        this.listing.categories = data.categories;
        this.loading.dismiss();
      });
  }


  goToRides() {
    console.log("Clicked goToRides");
    this.nav.push(RidesPage);
  }

}
