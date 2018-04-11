import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { Petrol } from './petrol';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'fuel-petrol',
  templateUrl: './fuel-petrol.component.html',
  styleUrls: ['./fuel-petrol.component.css']
})

export class FuelPetrolComponent implements OnInit {

  petrolForm: FormGroup;

  cols: any[];
  petrol: Petrol;

  displayDialog: boolean;
  selectedPetrol: Petrol;

  newPetrol: boolean;
  petrols: Petrol[];

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createPetrolForm();

    this.getPetrolsSample()
            .subscribe((data: Petrol[]) => {
                this.petrols = data;
            });

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

  getPetrolsSample(): Observable<Petrol[]> {
    return this.http.get<Petrol[]>('./assets/petrols.json');
  }

  showDialogToAdd() {
    this.newPetrol = true;
    this.petrol = new Petrol();
    this.displayDialog = true;
    this.createPetrolForm();
  }

  save() {
    let petrols = [...this.petrols];
    this.petrol = this.prepareSavePetrol();
    if (this.newPetrol) {
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
    return formModel;
  }

  onRowSelect(event) {
    this.newPetrol = false;
    this.petrol = this.clonePetrol(event.data);
    this.displayDialog = true;
    this.bindDataToForm(this.petrol);
  }

  clonePetrol(p: Petrol): Petrol {
    let petrol = new Petrol();
    for (let prop in p) {
      petrol[prop] = p[prop];
    }
    return petrol;
  }

  bindDataToForm(p: Petrol) {
    this.petrolForm = this.fb.group({ // <-- the parent FormGroup
      country: p.country,
      reportingYear: p.reportingYear,
      period: p.period,
      parentFuelGrade: p.parentFuelGrade,
      nationalFuelGrade: p.nationalFuelGrade,
      summerPeriodNorA: p.summerPeriodNorA,
      maximumBioethanolContent: p.maximumBioethanolContent,
      researchOctaneNumber: this.fb.group({
        unit: p.researchOctaneNumber.unit,
        numOfSamples: p.researchOctaneNumber.numOfSamples,
        min: p.researchOctaneNumber.min,
        max: p.researchOctaneNumber.max,
        median: p.researchOctaneNumber.median,
        standardDeviation: p.researchOctaneNumber.standardDeviation,
        toleranceLimit: p.researchOctaneNumber.toleranceLimit,
        sampleValue: p.researchOctaneNumber.sampleValue,
        nationalMin: p.researchOctaneNumber.nationalMin,
        nationalMax: p.researchOctaneNumber.nationalMax,
        directiveMin: p.researchOctaneNumber.directiveMin,
        directiveMax: p.researchOctaneNumber.directiveMax,
        method: p.researchOctaneNumber.method,
        date: p.researchOctaneNumber.date
      })
    });
  }

  createPetrolForm() {
    this.petrolForm = this.fb.group({ // <-- the parent FormGroup
      country: '',
      reportingYear: null,
      period: '',
      parentFuelGrade: '',
      nationalFuelGrade: '',
      summerPeriodNorA: '',
      maximumBioethanolContent: '',
      researchOctaneNumber: this.fb.group(
        this.getReportResultGroup()
      )
    })
  }

  getReportResultGroup(){
    return {
      unit: "",
      numOfSamples: null,
      min: null,
      max: null,
      median: null,
      standardDeviation: null,
      toleranceLimit: null,
      sampleValue: null,
      nationalMin: null,
      nationalMax: null,
      directiveMin: null,
      directiveMax: null,
      method: "",
      date: ""
    };
  }
}
