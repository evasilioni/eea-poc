import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Petrol} from './petrol';

import {ConfigService} from '../services/config.service';
import {PetrolFormValidators} from '../validators/petrol-form-validators';
import {ArrayControl} from '../dynamic-forms/controls/array-control';
import {FuelPetrolService} from '../fuel-petrol/fuel-petrol.service';
import {BaseControl} from '../dynamic-forms/controls/base-control';
import {FuelPetrol} from '../fuel-data';
import {FuelDataService} from '../services/fuel-data-service/fuel-data.service';
import {GroupControl} from '../dynamic-forms/controls/group-controll';
import {DynamicFormService} from '../dynamic-forms/dynamic-form/dynamic-form.service';


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
    commonControls: BaseControl<string>[];

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
                private cd: ChangeDetectorRef,
                private dynamicFormService: DynamicFormService) {

    }

    ngOnInit() {
        this.petrolFormValidator = new PetrolFormValidators(this.configService);
        const allControls = this.fuelPetrolService.getControls();
        this.controls = [allControls[0]];
        this.commonControls = allControls.slice(1);
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
            console.log('data', data);
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
        return groupControl;
    }

    showDialogToAdd() {
        const petrolGroupControl = this.createPetrolForm();
        const petrolsArray = this.petrolFormGroup.get('petrols') as FormArray;

        this.newPetrol = true;
        this.petrol = new Petrol();
        this.petrol.id = 'Petrol';
        this.displayDialog = true;
        this.selectedPetrolIndex = (this.controls[0] as ArrayControl).arrayControls.length - 1;
        this.petrolFormErrors = {};

        // TODO Manually create form group of new array element using explicitly the DynamicFormService.
        // We pass the controls to the customControls parameter because we want all nested FormGroups to be created immediately
        this.dynamicFormService.toFormGroup(
            [],
            petrolGroupControl.groupControls,
            petrolGroupControl.groupValidators,
            null,
            petrolsArray
        );
    }


    openFuelDialog(event) {
        this.selectedPetrolIndex = event.index;
        this.newPetrol = false;
        this.petrol = event.data;
        this.displayDialog = true;
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

    getBasicPetrolInfoControls() {
        const arrayControl = (this.controls[0] as ArrayControl);
        const petrolGroupControl = arrayControl.arrayControls[this.selectedPetrolIndex] as GroupControl;
        const basicPetrolInfoGroupControl = petrolGroupControl.groupControls
            .find(control => control.key === 'basicPetrolInfo') as GroupControl;
        return basicPetrolInfoGroupControl.groupControls;
    }

    getBasicPetrolInfoFormGroup() {
        const petrolsFormArray = this.petrolFormGroup.controls.petrols as FormArray;
        const petrolFormGroup = petrolsFormArray.controls[this.selectedPetrolIndex] as FormGroup;
        return petrolFormGroup.get('basicPetrolInfo');
    }

    getBasicPetrolInfoValue() {
        const currentPetrol = this.fuelPetrol.petrols[this.selectedPetrolIndex];
        if (currentPetrol) {
            return currentPetrol.basicPetrolInfo;
        }
    }

    getReportingResultsControls() {
        const arrayControl = (this.controls[0] as ArrayControl);
        const petrolGroupControl = arrayControl.arrayControls[this.selectedPetrolIndex] as GroupControl;
        return petrolGroupControl.groupControls;
    }

    getSamplingFrequencyControls() {
        const arrayControl = (this.controls[0] as ArrayControl);
        const petrolGroupControl = arrayControl.arrayControls[this.selectedPetrolIndex] as GroupControl;
        const sampleFrequencyGroupControl = petrolGroupControl.groupControls
            .find(control => control.key === 'sampleFrequency') as GroupControl;
        return sampleFrequencyGroupControl.groupControls;
    }

    getPetrolFormGroup(index: number) {
        const petrolsFormArray = this.petrolFormGroup.controls.petrols as FormArray;
        return petrolsFormArray.controls[index] as FormGroup;
    }

    getPetrolGroupControl(index: number) {
        const arrayControl = (this.controls[0] as ArrayControl);
        return arrayControl.arrayControls[index] as GroupControl;
    }
}



