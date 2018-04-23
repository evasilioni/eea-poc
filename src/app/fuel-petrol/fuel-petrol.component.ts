import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, FormArray, Validator } from '@angular/forms';
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

  parentForm: FormGroup;
  petrolForm: FormGroup;

  petrolFormValidator: PetrolFormValidators;

  cols: any[];
  reportResultTypes: any[];
  petrol: Petrol;

  displayDialog: boolean;
  selectedPetrolIndex: number;

  newPetrol: boolean;
  petrols: Petrol[];

  petrolFormErrors: {};

  constructor(private petrolService: PetrolService,
    private configService: ConfigService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.petrolFormValidator = new PetrolFormValidators(this.configService);

    this.parentForm = this.fb.group({
      'petrols': this.fb.array([])
    }, {
        validators: []
      });

    this.getPetrols();
    this.getColumns();
    this.getReportResultTypes();
  }

  getColumns(): void {
    this.configService.getPetrolSettings().subscribe((data: any[]) => {
      this.cols = data["cols"];
    });
  }

  getReportResultTypes(): void {
    this.configService.getPetrolSettings()
      .subscribe((data: any[]) => {
        this.reportResultTypes = data["reportResultTypes"]
      })
  }

  createPetrolForm() {
    this.petrolForm = this.fb.group({ // <-- the parent FormGroup
      id: "Petrol",
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
        validator: Validators.compose([this.petrolFormValidator.formGroupValidationFunction(),
        this.petrolFormValidator.uniqueCountry()])
      }
    );

    this.petrolForm.valueChanges.subscribe((form) => {
      this.onChanges(form);
    });


    let array = this.parentForm.get('petrols') as FormArray;
    array.push(this.petrolForm);
    this.selectedPetrolIndex = array.length - 1;
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
    let array = this.parentForm.get('petrols') as FormArray;
    this.petrolService.getPetrols()
      .subscribe((p: Petrol[]) => {
        p.forEach(pp => {
          pp.id = "Petrol " + pp.id;
          this.createPetrolForm();
          this.bindDataToForm(pp);
        })
        this.petrols = p;
      });
  }

  showDialogToAdd() {
    this.newPetrol = true;
    this.petrol = new Petrol();
    this.displayDialog = true;
    this.selectedPetrolIndex = undefined;
    this.createPetrolForm();
  }

  save() {
    let petrolF = (this.parentForm.get('petrols') as FormArray).controls[this.selectedPetrolIndex];
    if (petrolF.valid) {
      let petrols = [...this.petrols];
      let counter = petrols != undefined ? petrols.length + 1 : 0;
      petrolF.get('id').setValue("Petrol " + counter);
      this.petrol = this.prepareSavePetrol(petrolF);

      if (this.newPetrol) {
        petrols.push(this.petrol);
      }
      else {
        petrols[this.selectedPetrolIndex] = this.petrol;
      }
      this.petrols = petrols;
      this.petrol = null;
      this.displayDialog = false;
    }
  }

  delete() {
    this.petrols = this.petrols.filter((val, i) => i != this.selectedPetrolIndex);
    this.petrol = null;
    this.displayDialog = false;
    let array = this.parentForm.get('petrols') as FormArray;
    array.removeAt(this.selectedPetrolIndex);
  }

  close() {
    this.displayDialog = false;
    let array = this.parentForm.get('petrols') as FormArray;
    if (this.newPetrol) {
      array.removeAt(this.selectedPetrolIndex);
    }
  }

  prepareSavePetrol(petrolF: AbstractControl): Petrol {
    const formModel = petrolF.value;
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
    let array = this.parentForm.get('petrols') as FormArray;
    array.controls[this.selectedPetrolIndex].patchValue(p);
  }


  onChanges(form: AbstractControl) {
    let hasErrors = false;
    let selectedPetrolForm = (this.parentForm.get('petrols') as FormArray).controls[this.selectedPetrolIndex];

    if (selectedPetrolForm) {
      if (selectedPetrolForm.errors) {
        hasErrors = true;
        this.petrolFormErrors = selectedPetrolForm.errors;
      }

      if (this.reportResultTypes) {
        this.reportResultTypes.forEach(r => {
          if (selectedPetrolForm.errors && selectedPetrolForm.errors[r.field]) {
            hasErrors = true;
            this.petrolFormErrors['invalidNumberofSample'] = selectedPetrolForm.errors[r.field].invalidNumberofSample;
            this.petrolFormErrors['tabField'] = r.header;
          }
        })
      }

      Object.keys((selectedPetrolForm as FormArray).controls).forEach(key => {
        if (selectedPetrolForm.get(key).errors) {
          hasErrors = true;
          this.petrolFormErrors[key] = selectedPetrolForm.get(key).errors;
        }
      });

    }

    if (!hasErrors) { this.petrolFormErrors = {}; };

    console.log(this.petrolFormErrors);

    return null;
  }

}



