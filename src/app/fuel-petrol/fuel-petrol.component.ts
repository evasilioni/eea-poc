import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Petrol, ReportResult } from './petrol';
import { identifierModuleUrl } from '@angular/compiler';
import { PetrolService } from '../services/fuel-petrol-service/petrol.service';
import { ConfigService } from '../services/config.service';
import { isNull, isNullOrUndefined, isUndefined } from 'util';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'fuel-petrol',
  templateUrl: './fuel-petrol.component.html',
  styleUrls: ['./fuel-petrol.component.css']
})

export class FuelPetrolComponent implements OnInit {

  petrolForm: FormGroup;
  petrolFormValidator: PetrolFormValidators = new PetrolFormValidators(this.configService);

  cols: any[];
  reportResultTypes: any[];
  petrol: Petrol;

  displayDialog: boolean;
  selectedPetrolIndex: number;

  newPetrol: boolean;
  petrols: Petrol[];

  constructor(private petrolService: PetrolService,
    private configService: ConfigService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createPetrolForm();

    this.getPetrols();
    this.getColumns();
    this.getReportResultTypes();
  }

  getColumns(): void {
    this.configService.getPetrolSettings().subscribe((data: any[]) => {
      this.cols = data["cols"];
    }
    );
  }

  getReportResultTypes(): void {
    this.configService.getPetrolSettings()
      .subscribe((data: any[]) => {
        this.reportResultTypes = data["reportResultTypes"]
      })
  }

  createPetrolForm() {
    let counter = this.petrols != undefined ? this.petrols.length + 1 : 0;

    this.petrolForm = this.fb.group({ // <-- the parent FormGroup
      id: "Petrol " + counter,
      country: ['', Validators.required],
      reportingYear: ['', Validators.required],
      period: ['', Validators.required],
      parentFuelGrade: ['', Validators.required],
      nationalFuelGrade: '',
      summerPeriodNorA: '',
      maximumBioethanolContent: 0,
      researchOctaneNumber: this.fb.group(
        this.getReportResultGroup("--"),
        {
          validator: PetrolFormValidators.minMaxValidation()
        }
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
      ),
      sampleFrequency: this.fb.group({
        value: [0, Validators.required]
      })
    },
      {
        validator: this.petrolFormValidator.formGroupValidationFunction()
      })
  }

  getReportResultGroup(u: string) {
    return {
      unit: new FormControl({ value: u, disabled: true }),
      numOfSamples: [null, Validators.required],
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

  getPetrols(): void {
    this.petrolService.getPetrols()
      .subscribe((p: Petrol[]) => {
        p.forEach(pp => {
          pp.id = "Petrol " + pp.id;
        })
        this.petrols = p;
      }
      );
  }

  showDialogToAdd() {
    this.newPetrol = true;
    this.petrol = new Petrol();
    this.displayDialog = true;
    this.selectedPetrolIndex = undefined;
    this.createPetrolForm();
  }

  save() {
    if (this.petrolForm.valid) {
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

  close() {
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
    this.bindHeaderDataToForm(p, 'id');
    this.bindHeaderDataToForm(p, 'country');
    this.bindHeaderDataToForm(p, 'reportingYear');
    this.bindHeaderDataToForm(p, 'period');
    this.bindHeaderDataToForm(p, 'parentFuelGrade');
    this.bindHeaderDataToForm(p, 'nationalFuelGrade');
    this.bindHeaderDataToForm(p, 'summerPeriodNorA');
    this.bindHeaderDataToForm(p, 'maximumBioethanolContent');
    this.bindReportResultGroup(this.petrolForm.get('researchOctaneNumber'), p, 'researchOctaneNumber');
    this.bindReportResultGroup(this.petrolForm.get('motorOctanenumber'), p, 'motorOctanenumber');
    this.bindReportResultGroup(this.petrolForm.get('vapourPressure'), p, 'vapourPressure');
    this.bindReportResultGroup(this.petrolForm.get('distillationEvaporated100'), p, 'distillationEvaporated100');
    this.bindReportResultGroup(this.petrolForm.get('distillationEvaporated150'), p, 'distillationEvaporated150');
    this.bindSampleFrequency(this.petrolForm.get('sampleFrequency'), p, 'sampleFrequency');
  }

  bindHeaderDataToForm(p: Petrol, field: string) {
    this.petrolForm.get(field).setValue(p[field]);
  }

  bindReportResultGroup(control: AbstractControl, p: Petrol, type: string) {
    control.get('unit').setValue(p[type].unit);
    control.get('numOfSamples').setValue(p[type].numOfSamples);
    control.get('min').setValue(p[type].min);
    control.get('max').setValue(p[type].max);
    control.get('median').setValue(p[type].median);
    control.get('standardDeviation').setValue(p[type].standardDeviation);
    control.get('toleranceLimit').setValue(p[type].toleranceLimit);
    control.get('sampleValue').setValue(p[type].sampleValue);
    control.get('nationalMin').setValue(p[type].nationalMin);
    control.get('nationalMax').setValue(p[type].nationalMax);
    control.get('directiveMin').setValue(p[type].directiveMin);
    control.get('directiveMax').setValue(p[type].directiveMax);
    control.get('method').setValue(p[type].method);
    control.get('date').setValue(p[type].date);
  }

  bindSampleFrequency(control: AbstractControl, p: Petrol, type: string) {
    if (!isNullOrUndefined(control) && !isNullOrUndefined(p[type])) {
      control.get('value').setValue(p[type].value);
    }
  }
}


export class PetrolFormValidators {

  reportResultTypes: any[];

  constructor(private configService: ConfigService) {
    this.getReportResultTypes();
  }

  getReportResultTypes(): void {
    this.configService.getPetrolSettings()
      .subscribe((data: any[]) => {
        this.reportResultTypes = data["reportResultTypes"]
      })
  }

  static minMaxValidation() {
    return (control: AbstractControl): { [key: string]: any } => {
      let minValue = control.get('min');
      let maxValue = control.get('max');

      return minValue.value > maxValue.value ? { 'invalidNumberMin': true } : null;
    };
  }

  formGroupValidationFunction() {
    return (control: AbstractControl): {} => {
      let forbidden = false;
      let fieldTotal = control.get('sampleFrequency').get('value');

      var errors = {};

      if (this.reportResultTypes !== undefined) {
        this.reportResultTypes.forEach(r => {

          let invalidNumber = false;
          let fieldNumOfSamples = control.get(r.field).get('numOfSamples');
          invalidNumber = (parseInt(fieldNumOfSamples.value) > parseInt(fieldTotal.value)) &&
            (fieldTotal.value !== undefined) && (fieldNumOfSamples.value !== undefined);

          if (invalidNumber) {
            forbidden = true;
            console.log(control);
            Object.assign(errors, {
              [r.field]: {
                'invalidNumberofSample': true
              }
            });
          }
        });
      }


      return errors ? errors : null;
    }
  }
}



