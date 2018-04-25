import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Petrol } from './petrol';
import { PetrolService } from '../services/fuel-petrol-service/petrol.service';
import { ConfigService } from '../services/config.service';
import { PetrolFormValidators } from '../validators/petrol-form-validators';
import { ArrayControl } from '../dynamic-forms/controls/array-control';
import { FuelPetrolService } from '../fuel-petrol/fuel-petrol.service';
import { BaseControl } from '../dynamic-forms/controls/base-control';
import { FuelPetrol } from '../fuel-data';


@Component({
    selector: 'fuel-petrol',
    templateUrl: './fuel-petrol.component.html',
    styleUrls: ['./fuel-petrol.component.css']
})

export class FuelPetrolComponent implements OnInit {

    // @Input()
    petrols: Petrol[];

    @Input() parentForm: FormGroup;

    @Input() fuelPetrol: FuelPetrol;

    dynamicForm: FormGroup;
    petrolFormGroup: FormGroup;

    controls: BaseControl<string>[];



    /* Previous Vars*/
    petrolFormValidator: PetrolFormValidators;
    petrolForm: FormGroup;
    cols: any[];
    reportResultTypes: any[];
    petrol: Petrol;
    
    displayDialog: boolean;
    selectedPetrolIndex: number;

    newPetrol: boolean;
    petrolFormErrors: {};

    constructor(private petrolService: PetrolService,
        private configService: ConfigService,
        private fb: FormBuilder,
        private fuelPetrolService: FuelPetrolService) {
    }

    ngOnInit() {
        this.controls = this.fuelPetrolService.getControls();
        this.getPetrols();
        this.getColumns();
        this.getReportResultTypes();
    }

    // ngOnInit() {
    //     this.petrolFormValidator = new PetrolFormValidators(this.configService);

    //     this.parentForm = this.fb.group({
    //         'petrols': this.fb.array([])
    //     }, {
    //             validators: []
    //         });

    //     this.controls = this.fuelPetrolService.getControls();

    //     console.log(this.control);
    //     this.getPetrols();
    //     this.getColumns();
    //     this.getReportResultTypes();
    // }

    getColumns(): void {
        this.configService.getPetrolSettings().subscribe((data: any[]) => {
            this.cols = data['cols'];
        });
    }

    getReportResultTypes(): void {
        this.configService.getPetrolSettings()
            .subscribe((data: any[]) => {
                this.reportResultTypes = data['reportResultTypes'];
            });
    }

    getPetrols(): void {
        let index = 0;
        const array = this.parentForm.get('petrols') as FormArray;
    
        this.fuelPetrol.petrols.forEach(pp => {
            pp.id = 'Petrol ' + pp.id;
            this.createPetrolForm();
            // this.bindDataToForm(pp, index);
            index++;
        });
        this.petrols = this.fuelPetrol.petrols;
        // this.petrolService.getFuelPetrol()
        //     .subscribe((fuelPetrol: FuelPetrol) => {
        //         this.fuelPetrol = fuelPetrol;

        //         this.fuelPetrol.petrols.forEach(pp => {
        //             pp.id = 'Petrol ' + pp.id;
        //             this.createPetrolForm();
        //             // this.bindDataToForm(pp, index);
        //             index++;
        //         });
        //         this.petrols = fuelPetrol.petrols;
        //     });
    }

    /**
 * Gets a reference to the dynamic form group (for example to manually add extra non-dynamic controls).
 */
    retrieveFormGroup(formGroup: FormGroup) {
        this.dynamicForm = formGroup;
    }

    retrievePetrolFormGroup(formGroup: FormGroup) {
        this.petrolFormGroup = formGroup;
    }

    createPetrolForm() {
        const groupControl = this.fuelPetrolService.createPetrolGroupControl();
        (this.controls[0] as ArrayControl).push(groupControl);
        // this.parentForm.controls.petrol.controls['petrols'].controls.push(groupControl);
    }
    // createPetrolForm() {
    //     this.petrolForm = this.fb.group({ // <-- the parent FormGroup
    //             id: 'Petrol',
    //             country: ['', Validators.required],
    //             reportingYear: ['', Validators.required],
    //             period: ['', Validators.required],
    //             parentFuelGrade: ['', Validators.required],
    //             nationalFuelGrade: '',
    //             summerPeriodNorA: '',
    //             maximumBioethanolContent: 0,
    //             researchOctaneNumber: this.fb.group(
    //                 this.getReportResultGroup('--'),
    //                 {
    //                     validator: this.petrolFormValidator.minMaxValidation()
    //                 }
    //             ),
    //             motorOctanenumber: this.fb.group(
    //                 this.getReportResultGroup('--')
    //             ),
    //             vapourPressure: this.fb.group(
    //                 this.getReportResultGroup('kPa')
    //             ),
    //             distillationEvaporated100: this.fb.group(
    //                 this.getReportResultGroup('% V/V')
    //             ),
    //             distillationEvaporated150: this.fb.group(
    //                 this.getReportResultGroup('% V/V')
    //             ),
    //             sampleFrequency: this.fb.group({
    //                 value: [0, Validators.required]
    //             })
    //         },
    //         {
    //             validator: Validators.compose([this.petrolFormValidator.formGroupValidationFunction(),
    //                 this.petrolFormValidator.uniqueCountry()])
    //         }
    //     );

    //     this.petrolForm.valueChanges.subscribe((form) => {
    //         this.onChanges(form);
    //     });


    //     const array = this.parentForm.get('petrols') as FormArray;
    //     array.push(this.petrolForm);
    //     this.selectedPetrolIndex = array.length - 1;
    // }

    // getReportResultGroup(u: string) {
    //     return {
    //         unit: new FormControl({value: u, disabled: true}),
    //         numOfSamples: [null, Validators.required],
    //         min: null,
    //         max: null,
    //         median: null,
    //         standardDeviation: null,
    //         toleranceLimit: null,
    //         sampleValue: null,
    //         nationalMin: null,
    //         nationalMax: null,
    //         directiveMin: null,
    //         directiveMax: null,
    //         method: '',
    //         date: ''
    //     };
    // }

    // showDialogToAdd() {
    //     this.newPetrol = true;
    //     this.petrol = new Petrol();
    //     this.displayDialog = true;
    //     this.selectedPetrolIndex = undefined;
    //     this.createPetrolForm();
    //     this.petrolFormErrors = {};
    // }

    // save() {
    //     const petrolF = (this.parentForm.get('petrols') as FormArray).controls[this.selectedPetrolIndex];
    //     if (petrolF.valid) {
    //         const petrols = [...this.petrols];
    //         const counter = petrols !== undefined ? petrols.length + 1 : 0;
    //         petrolF.get('id').setValue('Petrol ' + counter);
    //         this.petrol = this.prepareSavePetrol(petrolF);

    //         if (this.newPetrol) {
    //             petrols.push(this.petrol);
    //         } else {
    //             petrols[this.selectedPetrolIndex] = this.petrol;
    //         }
    //         this.petrols = petrols;
    //         this.petrol = null;
    //         this.displayDialog = false;
    //     }
    // }

    // delete() {
    //     this.petrols = this.petrols.filter((val, i) => i !== this.selectedPetrolIndex);
    //     this.petrol = null;
    //     this.displayDialog = false;
    //     const array = this.parentForm.get('petrols') as FormArray;
    //     array.removeAt(this.selectedPetrolIndex);
    // }

    // close() {
    //     this.displayDialog = false;
    //     const array = this.parentForm.get('petrols') as FormArray;
    //     if (this.newPetrol) {
    //         array.removeAt(this.selectedPetrolIndex);
    //     }
    // }

    // prepareSavePetrol(petrolF: AbstractControl): Petrol {
    //     const formModel = petrolF.value;
    //     return formModel;
    // }

    openFuelDialog(event) {
        this.selectedPetrolIndex = event.index;
        this.newPetrol = false;
        this.petrol = event.data;
        this.displayDialog = true;
        console.log(this.petrolFormGroup);
        console.log(this.petrolFormGroup.controls.petrols.controls[this.selectedPetrolIndex]);
        // this.bindDataToForm(this.petrol);
    }


    bindDataToForm(p: Petrol, index: number) {
        const array = this.parentForm.controls.petrol.controls['petrols'] as FormArray;
        array.controls[index].groupControls.patchValue(p);
        // array.controls[index].groupControls.forEach(gr => { gr.key === p.country ? gr.value = 'Whatever' : gr.value = 'noo'; });
    }


    // onChanges(form: AbstractControl) {
    //     let hasErrors = false;
    //     const selectedPetrolForm = (this.parentForm.get('petrols') as FormArray).controls[this.selectedPetrolIndex];

    //     if (selectedPetrolForm) {
    //         if (selectedPetrolForm.errors) {
    //             hasErrors = true;
    //             this.petrolFormErrors = selectedPetrolForm.errors;
    //         }

    //         if (this.reportResultTypes) {
    //             this.reportResultTypes.forEach(r => {
    //                 if (selectedPetrolForm.errors && selectedPetrolForm.errors[r.field]) {
    //                     hasErrors = true;
    //                     this.petrolFormErrors['invalidNumberofSample'] = selectedPetrolForm.errors[r.field].invalidNumberofSample;
    //                     this.petrolFormErrors['tabField'] = r.header;
    //                 }
    //             });
    //         }

    //         Object.keys((selectedPetrolForm as FormArray).controls).forEach(key => {
    //             if (selectedPetrolForm.get(key).errors) {
    //                 hasErrors = true;
    //                 this.petrolFormErrors[key] = selectedPetrolForm.get(key).errors;
    //             }
    //         });

    //     }

    //     if (!hasErrors) {
    //         this.petrolFormErrors = {};
    //     }


    //     // console.log(this.petrolFormErrors);

    //     return null;
    // }

}



