import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, FormArray } from '@angular/forms';
import { Petrol, ReportResult } from './petrol';
import { identifierModuleUrl } from '@angular/compiler';
import { PetrolService } from '../services/fuel-petrol-service/petrol.service';
import { ConfigService } from '../services/config.service';
import { isNull, isNullOrUndefined, isUndefined } from 'util';
import { Observable } from 'rxjs/Observable';
import { PetrolFormValidators } from '../validators/petrol-form-validators';

@Component({
  selector: 'fuel-petrol',
  templateUrl: './fuel-petrol.component.html',
  styleUrls: ['./fuel-petrol.component.css']
})

export class FuelPetrolComponent implements OnInit {

  parentForm: FormArray;
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

    this.parentForm = this.fb.array([
      this.petrolForm
    ]);

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
          validator: this.petrolFormValidator.minMaxValidation()
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
        validators: [this.petrolFormValidator.formGroupValidationFunction()]
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
    this.petrolForm.patchValue(p);
  }



}



