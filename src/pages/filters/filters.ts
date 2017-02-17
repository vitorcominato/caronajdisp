import { Component, ViewChild } from '@angular/core';
import { NavController, Range, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Geolocation} from 'ionic-native';
import { counterRangeValidator } from '../../components/counter-input/counter-input';

import { Observable } from 'rxjs/Observable';

import { GoogleMap } from "../../components/google-map/google-map";
import { GoogleMapsService } from "../maps/maps.service";
import { MapsModel } from '../maps/maps.model';

@Component({
  selector: 'filters-page',
  templateUrl: 'filters.html'
})
export class FiltersPage {
  @ViewChild(GoogleMap) _GoogleMap: GoogleMap;
  map_model: MapsModel = new MapsModel();
  filterForm: any;
  checkboxForm: FormGroup;
  radioForm: FormGroup;
  checkboxTagsForm: FormGroup;
  radioTagsForm: FormGroup;
  switchersForm: FormGroup;
  counterForm: any;
  ratingForm: FormGroup;
  radioColorForm: FormGroup;
  today: any;
  track: any;



  constructor(
      public nav: NavController, 
      private modalCtrl: ModalController, 
      public loadingCtrl: LoadingController,
      public GoogleMapsService: GoogleMapsService,
      public toastCtrl: ToastController
    ) {
    this.today = new Date().toISOString();
    this.track = {
      from: {},
      to: {}
    }
    this.filterForm = new FormGroup({
      single: new FormControl({lower: 1, upper: 10}),
      dual: new FormControl({lower: 0, upper: 300}),
      dateFrom: new FormControl(new Date().toISOString()),
      dateTo: new FormControl(new Date("12/31/2099").toISOString()),
      locationFrom: new FormControl(),
      locationTo: new FormControl()
    });

    


    this.checkboxForm = new FormGroup({
      person_1: new FormControl(true),
      person_2: new FormControl(false),
      person_3: new FormControl(false),
      person_4: new FormControl(true),
      person_5: new FormControl(false)
    });

    this.radioForm = new FormGroup({
      selected_option: new FormControl('apple')
    });

    this.checkboxTagsForm = new FormGroup({
      tag_1: new FormControl(false),
      tag_2: new FormControl(false),
      tag_3: new FormControl(true),
      tag_4: new FormControl(true),
      tag_5: new FormControl(false),
      tag_6: new FormControl(false),
      tag_7: new FormControl(true),
      tag_8: new FormControl(false)
    });

    this.radioTagsForm = new FormGroup({
      selected_option: new FormControl('any')
    });

    this.switchersForm = new FormGroup({
      notifications: new FormControl(true),
      email_notifications: new FormControl(false)
    });

    this.counterForm = new FormGroup({
      counter: new FormControl(5, counterRangeValidator(7, 1)),
      counter2: new FormControl(2, counterRangeValidator(5, 1))
    });

    this.ratingForm = new FormGroup({
      rate: new FormControl(2.5),
      rate2: new FormControl(1.5)
    });

    this.radioColorForm = new FormGroup({
      selected_color: new FormControl('#fc9961')
    });
  }

  ngOnInit() {
    let _loading = this.loadingCtrl.create();
    _loading.present();

    this._GoogleMap.$mapReady.subscribe(map => {
      this.map_model.init(map);
      this.geolocateMe();
      _loading.dismiss();

    });
  }

  rangeChange(range: Range) {
    console.log(`range, change, ratio: ${range.ratio}, value: ${range.value}`);
  }

  searchPlacesPredictions(type: string){
    let env = this;
    let query = env.filterForm.controls[type].value;
    console.log(query);
    if(query !== "")
    {
      env.GoogleMapsService.getPlacePredictions(query).subscribe(
        places_predictions => { 
          if(type == 'locationFrom'){
            env.map_model.search_places_predictions = places_predictions;  
          }else{
            env.map_model.search_places_predictionsTo = places_predictions;  
          }
        },
        e => {
          console.log('onError: %s', e);
        },
        () => {
          console.log('onCompleted');
        }
      );
    }else{
      env.map_model.search_places_predictions = [];
    }
  }

  selectSearchResult(place: google.maps.places.AutocompletePrediction, type: any){
    let env = this;

    env.map_model.search_query = place.description;
    env.map_model.search_places_predictions = [];
    env.map_model.search_places_predictionsTo = [];

    // We need to get the location from this place. Let's geocode this place!
    env.GoogleMapsService.geocodePlace(place.place_id).subscribe( 
      place_location => {
        /*var geo = new google.maps.Geocoder();
        geo.geocode({address: item}, function(data){
          obj.viewCtrl.dismiss(data[0]);
        });*/
        (<FormControl>env.filterForm.controls[type]).setValue(place.description);
        if(type == "locationFrom"){
          env.track.from = place_location;
        }else{
          env.track.to = place_location;
        }
        env.setTrack();
      },
      e => {
        console.log('onError: %s', e);
      },
      () => {
        console.log('onCompleted');
      }
    );
  }

  setOrigin(location: google.maps.LatLng){
    let env = this;

    // Clean map
    env.map_model.cleanMap();

    env.map_model.addPlaceToMap(location);

    // With this result we should find restaurants (*places) arround this location and then show them in the map
    let bound = new google.maps.LatLngBounds();
    bound.extend(location);  
    // Select first place to give a hint to the user about how this works
    //env.choosePlace(env.map_model.nearby_places[0]);

    // To fit map with places
    env.map_model.map.fitBounds(bound);
    
  }

  geolocateMe(){
    let env = this,
        _loading = env.loadingCtrl.create();

    _loading.present();

    Geolocation.getCurrentPosition().then((position) => {
      let current_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      env.map_model.search_query = position.coords.latitude.toFixed(2) + ", " + position.coords.longitude.toFixed(2);
      env.setOrigin(current_location);
      env.map_model.using_geolocation = true;

      _loading.dismiss();
    }).catch((error) => {
      console.log('Error getting location', error);
      _loading.dismiss();
    });
  }

  setTrack(){
    let env = this,
        from = env.filterForm.controls.locationFrom.value,
        to = env.filterForm.controls.locationTo.value;


    // Check if the place is not already selected
    if(from != null && to != null){
      // De-select previous places
      env.map_model.deselectPlaces();
      // Select current place
      // place.select();
      console.log(env.track.from)
      // Get both route directions and distance between the two locations
      let directions_observable = env.GoogleMapsService
            .getDirections(env.track.from, env.track.to),
          distance_observable = env.GoogleMapsService
            .getDistanceMatrix(env.track.from, env.track.to);

      Observable.forkJoin(directions_observable, distance_observable).subscribe(
        data => {
          let directions = data[0];

          env.map_model.cleanMap();

          console.log(directions);
          env.map_model.directions_origin.location = env.track.from;
          env.map_model.addPlaceToMap(env.track.from, '#00e9d5');
          env.map_model.addPlaceToMap(env.track.to, '#00e9d5');

          let bound = new google.maps.LatLngBounds();

          bound.extend(env.track.from);
          bound.extend(env.track.to);
          env.map_model.map.fitBounds(bound);

          env.map_model.directions_display.setDirections(directions);

          /*let toast = env.toastCtrl.create({
                message: 'That\'s '+distance+' away and will take '+duration,
                duration: 3000
              });
          toast.present();*/
        },
        e => {
          console.log('onError: %s', e);
        },
        () => {
          console.log('onCompleted');
        }
      );
    }
  }


}
