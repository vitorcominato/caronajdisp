import { Component } from '@angular/core';
import { NavController, Range, ModalController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';
import {AutocompletePage} from './autocomplete';

@Component({
  selector: 'filters-page',
  templateUrl: 'filters.html'
})
export class FiltersPage {
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



  constructor(public nav: NavController, private modalCtrl: ModalController) {
    this.today = new Date().toISOString();
    this.filterForm = new FormGroup({
      single: new FormControl({lower: 1, upper: 10}),
      dual: new FormControl({lower: 0, upper: 300}),
      dateFrom: new FormControl(new Date().toISOString()),
      dateTo: new FormControl(new Date("12/31/2099").toISOString()),
      locationFrom: new FormControl()
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

  rangeChange(range: Range) {
    console.log(`range, change, ratio: ${range.ratio}, value: ${range.value}`);
  }

  showAddressModal () {
    let modal = this.modalCtrl.create(AutocompletePage);
    modal.onDidDismiss(data => {
      this.filterForm.controls.locationFrom = data;
    });
    modal.present();
  }
}
