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
  selectedPetrol: Petrol;

  newPetrol: boolean;
  petrols: Petrol[];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.petrols = [];

    let petrol = {
      'country':"Germany",
      "reportingYear":2016,
      // "period":"Summer",
      // "parentFuelGrade":"",
      // "summerPeriodNorA":"",
      // "maximumBioethanolContent":"",
      // "nationalFuelGrade":"",
      // "researchOctaneNumber":null
    };

    this.petrols.push(petrol);

    this.createPetrolForm();

    this.cols = [
      { field: 'country', header: 'Country' },
      { field: 'reportingYear', header: 'Reporting Year' }
      // { field: 'period', header: 'Period(Summer or Winter)' },
      // { field: 'parentFuelGrade', header: 'Parent Fuel Grade' },
      // { field: 'nationalFuelGrade', header: 'National Fuel Grade' },
      // { field: 'summerPeriodNorA', header: 'Summer Period (N or A)' },
      // { field: 'maximumBioethanolContent', header: 'The maximum bioethanol content (% v/v)' }
    ];
  }

  showDialogToAdd() {
    this.newPetrol = true;
    this.petrol = new Petrol();
    this.displayDialog = true;
    this.createPetrolForm();
  }

  save() {
    let petrols = [...this.petrols];
    if (this.newPetrol) {
      this.petrol = this.prepareSavePetrol();
      petrols.push(this.petrol);
    }
    else
      petrols[this.petrols.indexOf(this.selectedPetrol)] = this.petrol;
    this.petrols = petrols;
    this.petrol = null;
    this.displayDialog = false;
  }

  delete() {
    let index = this.petrols.indexOf(this.selectedPetrol);
    this.petrols = this.petrols.filter((val, i) => i != index);
    this.petrol = null;
    this.displayDialog = false;
  }

  prepareSavePetrol(): Petrol {
    const formModel = this.petrolForm.value;

    const savePetrol: Petrol = {
        country: formModel.country,
        reportingYear: formModel.reportingYear
        // period: formModel.period,
        // parentFuelGrade: formModel.parentFuelGrade,
        // nationalFuelGrade: formModel.nationalFuelGrade,
        // summerPeriodNorA: formModel.summerPeriodNorA,
        // maximumBioethanolContent: formModel.maximumBioethanolContent,
        // researchOctaneNumber: formModel.researchOctaneNumber
    }

    return savePetrol;
}


  createPetrolForm() {
    this.petrolForm = this.fb.group({ // <-- the parent FormGroup
      country: '',
      reportingYear: null
      // period: '',
      // parentFuelGrade: '',
      // nationalFuelGrade: '',
      // summerPeriodNorA: '',
      // maximumBioethanolContent: '',
      // researchOctaneNumber: this.fb.group({
      //   unit: "",
      //   numOfSamples: null,
      //   min: null,
      //   max: null,
      //   median: null,
      //   standardDeviation: null,
      //   toleranceLimit: null,
      //   sampleValue: null,
      //   nationalMin: null,
      //   nationalMax: null,
      //   directiveMin: null,
      //   directiveMax: null,
      //   method: "",
      //   date: ""
      // })
    })
  }
}
