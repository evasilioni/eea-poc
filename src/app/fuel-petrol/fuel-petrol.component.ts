import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Petrol} from './petrol';

import {ArrayControl} from '../dynamic-forms/controls/array-control';
import {FuelPetrolService} from '../fuel-petrol/fuel-petrol.service';
import {BaseControl} from '../dynamic-forms/controls/base-control';
import {FuelPetrol} from '../fuel-data';
import {GroupControl} from '../dynamic-forms/controls/group-controll';
import {PetrolFormValidators} from './petrol-form-validators';
import {FuelDataService} from '../fuel-data.service';
import {ConfigService} from '../config.service';


@Component({
    selector: 'fuel-petrol',
    templateUrl: './fuel-petrol.component.html',
    styleUrls: ['./fuel-petrol.component.css']
})

export class FuelPetrolComponent implements OnInit, AfterViewInit {

    @Input() parentForm: FormGroup;

    @Input() fuelPetrol: FuelPetrol;

    petrolFormGroup: FormGroup;

    controls: BaseControl<string>[];

    commonControls: BaseControl<string>[];

    petrolFormValidator: PetrolFormValidators;

    cols: any[];

    reportResultTypes: any[];

    petrol: Petrol;

    selectedPetrolIndex: number;

    constructor(private petrolService: FuelDataService,
                private configService: ConfigService,
                private fb: FormBuilder,
                private fuelPetrolService: FuelPetrolService,
                private cd: ChangeDetectorRef) {

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

    getPetrolFormGroup(index: number) {
        const petrolsFormArray = this.petrolFormGroup.controls.petrols as FormArray;
        return petrolsFormArray.controls[index] as FormGroup;
    }

    getPetrolGroupControl(index: number) {
        const arrayControl = (this.controls[0] as ArrayControl);
        return arrayControl.arrayControls[index] as GroupControl;
    }
}



