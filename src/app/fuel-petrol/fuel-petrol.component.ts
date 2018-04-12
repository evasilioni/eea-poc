import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Petrol, ReportResult } from './petrol';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'fuel-petrol',
  templateUrl: './fuel-petrol.component.html',
  styleUrls: ['./fuel-petrol.component.css']
})

export class FuelPetrolComponent implements OnInit {

  petrolForm: FormGroup;

  cols: any[];
  reportResultTypes: any[];
  petrol: Petrol;

  displayDialog: boolean;
  selectedPetrolIndex: number;

  newPetrol: boolean;
  petrols: Petrol[];

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createPetrolForm();

    this.getPetrolsSample()
      .subscribe((data: Petrol[]) => {
        this.petrols = data;

        this.petrols.forEach(p=>{
          p.id = "Petrol " + p.id;
        })
      });

    this.cols = [
      { field: 'id', header: '#' },
      { field: 'country', header: 'Country' },
      { field: 'reportingYear', header: 'Reporting Year' },
      { field: 'period', header: 'Period(Summer or Winter)' },
      { field: 'parentFuelGrade', header: 'Parent Fuel Grade' },
      { field: 'nationalFuelGrade', header: 'National Fuel Grade' },
      { field: 'sumui-g-2merPeriodNorA', header: 'Summer Period (N or A)' },
      { field: 'maximumBioethanolContent', header: 'The maximum bioethanol content (% v/v)' }
    ];

    this.reportResultTypes = [
      {id:1, field:'researchOctaneNumber', header: 'Research Octane Number' },
      {id:2, field:'motorOctanenumber', header: 'Motor Octane Number' },
      {id:3, field:'vapourPressure', header: 'Vapour Pressure' },
      {id:4, field:'distillationEvaporated100', header: 'Distillation Evaporated 100' },
      {id:5, field:'distillationEvaporated150', header: 'Distillation Evaporated 150' },
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
    if(this.petrolForm.valid){
      let petrols = [...this.petrols];
      this.petrol = this.prepareSavePetrol();
      if (this.newPetrol) {
        petrols.push(this.prepareSavePetrol());
      }
      else
        petrols[this.selectedPetrolIndex] = this.petrol;
      this.petrols = petrols;
      this.petrol = null;
      this.displayDialog = false;
    }
  }

  delete() {
    this.petrols = this.petrols.filter((val, i) => i != this.selectedPetrolIndex);
    this.petrol = null;
    this.displayDialog = false;
  }

  prepareSavePetrol(): Petrol {
    const formModel = this.petrolForm.value;
    return formModel;
  }

  onRowSelect(event) {
    this.selectedPetrolIndex = event.index;
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
      id: p.id,
      country: p.country,
      reportingYear: p.reportingYear,
      period: p.period,
      parentFuelGrade: p.parentFuelGrade,
      nationalFuelGrade: p.nationalFuelGrade,
      summerPeriodNorA: p.summerPeriodNorA,
      maximumBioethanolContent: p.maximumBioethanolContent,
      researchOctaneNumber: this.fb.group(
        this.bindReportResultGroup(p, 'researchOctaneNumber')),
      motorOctanenumber: this.fb.group(
        this.bindReportResultGroup(p, 'motorOctanenumber')),
      vapourPressure: this.fb.group(
        this.bindReportResultGroup(p, 'vapourPressure')),
      distillationEvaporated100: this.fb.group(
        this.bindReportResultGroup(p, 'distillationEvaporated100')),
      distillationEvaporated150: this.fb.group(
        this.bindReportResultGroup(p, 'distillationEvaporated150')),
    });
  }

  bindReportResultGroup(p: Petrol, type: string){
    return {
      unit: p[type].unit,
      numOfSamples: p[type].numOfSamples,
      min: p[type].min,
      max: p[type].max,
      median: p[type].median,
      standardDeviation: p[type].standardDeviation,
      toleranceLimit: p[type].toleranceLimit,
      sampleValue: p[type].sampleValue,
      nationalMin: p[type].nationalMin,
      nationalMax: p[type].nationalMax,
      directiveMin: p[type].directiveMin,
      directiveMax: p[type].directiveMax,
      method: p[type].method,
      date: p[type].date
    }
  }
  createPetrolForm() {
    let counter = this.petrols != undefined ? this.petrols.length + 1 : 0;
    this.petrolForm = this.fb.group({ // <-- the parent FormGroup
      id: "Petrol " + counter,
      country: ['', Validators.required],
      reportingYear: [null, Validators.required],
      period: '',
      parentFuelGrade: '',
      nationalFuelGrade: '',
      summerPeriodNorA: '',
      maximumBioethanolContent: '',
      researchOctaneNumber: this.fb.group(
        this.getReportResultGroup("--")
      ),
      motorOctanenumber: this.fb.group(
        this.getReportResultGroup("--")
      ),
      vapourPressure: this.fb.group(
        this.getReportResultGroup("kPa")
      ),
      distillationEvaporated100: this.fb.group(
        this.getReportResultGroup("% V/V")
      ),
      distillationEvaporated150: this.fb.group(
        this.getReportResultGroup("% V/V")
      )
    })
  }

  getReportResultGroup(u: string) {
    return {
      unit: new FormControl({value: u, disabled: true}, Validators.required),
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
