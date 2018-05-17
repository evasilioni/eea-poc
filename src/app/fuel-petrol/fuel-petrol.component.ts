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
import {DynamicFormService} from '../dynamic-forms/dynamic-form/dynamic-form.service';


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
    private defaultEmptyPetrols: Petrol[];

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
            this.cols = data['cols'];
            this.defaultEmptyPetrols = data['defaultEmptyValues']['petrols'];
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

    getPetrolHeader(index: number) {
        return (index + 1) % 3 !== 0 ? 'Petrol (' + (index + 1) + ')' : 'Petrol (' + (index - 1) + '+' + index + ')';
    }

    addPetrol() {
        const petrolsArray = this.petrolFormGroup.controls.petrols as FormArray;
        const startIndex = this.fuelPetrol.petrols.length;

        for (let i = 0; i < 3; i++) {
            const newPetrol = Object.assign({}, this.defaultEmptyPetrols[i], {id: 'Petrol ' + (startIndex + i + 1)});
            this.fuelPetrol.petrols = [...this.fuelPetrol.petrols, newPetrol];
            const petrolGroupControl = this.createPetrolForm();
            // Manually create form group of new array element using explicitly the DynamicFormService.
            // We pass the controls to the customControls parameter because we want all nested FormGroups to be created immediately
            this.dynamicFormService.toFormGroup(
                [],
                petrolGroupControl.groupControls,
                petrolGroupControl.groupValidators,
                null,
                petrolsArray
            );
        }
    }

    handleRemovePetrol($event) {
        const petrolIndex = $event.index;
        this.fuelPetrol.petrols.splice(petrolIndex - 2, 3);
        // TODO : the following removals should be implemented into a service
        const array = (this.petrolFormGroup.controls.petrols) as FormArray;
        array.controls.splice(petrolIndex - 2, 3);
        const petrolArray = (this.controls[0] as ArrayControl);
        petrolArray.arrayControls.splice(petrolIndex - 2, 3);
    }
}



