import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { Petrol } from './petrol';
import { empty } from 'rxjs/Observer';

@Component({
  selector: 'app-petrol',
  templateUrl: './app-petrol.component.html',
  styleUrls: ['./app-petrol.component.css']
})

export class AppPetrolComponent implements OnInit {

  petrolForm: FormGroup;

  cols: any[];
  petrol: Petrol;

  displayDialog: boolean;

  newPetrol: boolean;
  petrols: Petrol[];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.petrolForm = this.fb.group({ // <-- the parent FormGroup
      country: [''],
      reportingYear: null,
      period: [''],
      parentFuelGrade: '',
      nationalFuelGrade: '',
      summerPeriodNorA: '',
      maximumBioethanolContent: '',
    //   researchOctaneNumber: this.fb.group({
    //     unit: "",
    //     numOfSamples: 0,
    //     min: 0,
    //     max: 0,
    //     median: 0,
    //     standardDeviation: 0,
    //     toleranceLimit: 0,
    //     sampleValue: 0,
    //     nationalMin: 0,
    //     nationalMax: 0,
    //     directiveMin: 0,
    //     directiveMax: 0,
    //     method: "",
    //     date: ""
    //   })
    })

    this.cols = [
      { field: 'country', header: 'Country' },
      { field: 'reportingYear', header: 'Reporting Year' },
      { field: 'period', header: 'Period(Summer or Winter)' },
      { field: 'parentFuelGrade', header: 'Parent Fuel Grade' },
      { field: 'nationalFuelGrade', header: 'National Fuel Grade' },
      { field: 'summerPeriodNorA', header: 'Summer Period (N or A)' },
      { field: 'maximumBioethanolContent', header: 'The maximum bioethanol content (% v/v)' }
    ];
  }

  showDialogToAdd() {
    this.newPetrol = true;
    // this.petrol = {};
    this.displayDialog = true;
}
}
