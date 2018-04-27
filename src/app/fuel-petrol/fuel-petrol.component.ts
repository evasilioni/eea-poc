import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Petrol } from './petrol';

import { ConfigService } from '../services/config.service';
import { PetrolFormValidators } from '../validators/petrol-form-validators';
import { ArrayControl } from '../dynamic-forms/controls/array-control';
import { FuelPetrolService } from '../fuel-petrol/fuel-petrol.service';
import { BaseControl } from '../dynamic-forms/controls/base-control';
import { FuelPetrol } from '../fuel-data';
import { FuelDataService } from '../services/fuel-data-service/fuel-data.service';


@Component({
    selector: 'fuel-petrol',
    templateUrl: './fuel-petrol.component.html',
    styleUrls: ['./fuel-petrol.component.css']
})

export class FuelPetrolComponent implements OnInit, AfterViewInit {

    // petrols: Petrol[];

    @Input() parentForm: FormGroup;

    @Input() fuelPetrol: FuelPetrol;

    dynamicForm: FormGroup;
    petrolFormGroup: FormGroup;

    controls: BaseControl<string>[];

    petrolFormValidator: PetrolFormValidators;
    cols: any[];
    reportResultTypes: any[];
    petrol: Petrol;

    displayDialog: boolean;
    selectedPetrolIndex: number;

    newPetrol: boolean;
    petrolFormErrors: {};

    constructor(private petrolService: FuelDataService,
        private configService: ConfigService,
        private fb: FormBuilder,
        private fuelPetrolService: FuelPetrolService,
        private cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.petrolFormValidator = new PetrolFormValidators(this.configService);
        this.controls = this.fuelPetrolService.getControls();
        this.getPetrols();
        this.getColumns();
        this.getReportResultTypes();
    }

    // TODO check if there is a better way to avoid error ExpressionChangedAfterItHasBeenCheckedError (comment line to see the error)
    ngAfterViewInit() {
        this.cd.detectChanges();
    }

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
        const petrolArray = (this.controls[0] as ArrayControl);
        petrolArray.push(groupControl);
        this.selectedPetrolIndex = petrolArray.arrayControls.length - 1;
    }

    showDialogToAdd() {
        this.newPetrol = true;
        this.petrol = new Petrol();
        this.petrol.id = 'Petrol';
        this.displayDialog = true;
        this.selectedPetrolIndex = undefined;
        this.createPetrolForm();
        this.petrolFormErrors = {};
    }


    openFuelDialog(event) {
        this.selectedPetrolIndex = event.index;
        this.newPetrol = false;
        this.petrol = event.data;
        this.displayDialog = true;
        console.log(this.petrolFormGroup.controls.petrols.controls[this.selectedPetrolIndex]);
    }

    save() {
        const transientPetrolForm = (this.petrolFormGroup.controls.petrols as FormArray).controls[this.selectedPetrolIndex];
        if (transientPetrolForm.valid) {
            const petrols = [...this.fuelPetrol.petrols];
            this.petrol = transientPetrolForm.value;

            if (this.newPetrol) {
                const counter = petrols !== undefined ? petrols.length + 1 : 0;
                this.petrol.id = 'Petrol ' + counter;
                petrols.push(this.petrol);
            } else {
                const num = this.selectedPetrolIndex + 1;
                this.petrol.id = 'Petrol ' + num;
                petrols[this.selectedPetrolIndex] = this.petrol;
            }
            this.fuelPetrol.petrols = petrols;
            this.petrol = null;
            this.displayDialog = false;
        }
    }

    delete() {
        this.fuelPetrol.petrols = this.fuelPetrol.petrols.filter((val, i) => i !== this.selectedPetrolIndex);
        this.petrol = null;
        this.displayDialog = false;

        // TODO : the following removals should be implemented into a service
        const array = (this.petrolFormGroup.controls.petrols) as FormArray;
        array.removeAt(this.selectedPetrolIndex);

        const petrolArray = (this.controls[0] as ArrayControl);
        petrolArray.removeAt(this.selectedPetrolIndex);
        this.selectedPetrolIndex = undefined;
    }

    close() {
        this.displayDialog = false;
        if (this.newPetrol) {
            // TODO : the following removals should be implemented into a service
            const array = (this.petrolFormGroup.controls.petrols) as FormArray;
            array.removeAt(this.selectedPetrolIndex);

            const petrolArray = (this.controls[0] as ArrayControl);
            petrolArray.removeAt(this.selectedPetrolIndex);
            this.selectedPetrolIndex = undefined;
        }
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



