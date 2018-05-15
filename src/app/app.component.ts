import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FuelData} from './fuel-data';
import {parse} from 'js2xmlparser';
import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';
import {BaseControl} from './dynamic-forms/controls/base-control';
import {FuelDataService} from './fuel-data.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'app';

    fuelData: FuelData;

    parentForm: FormGroup;

    parentControls: BaseControl<any>[] = [];

    topValidators: ValidatorFn[];

    controls: BaseControl<any>[];

    fuelDataXml() {
        if (this.fuelData !== undefined) {
            return parse('fuel-data', this.fuelData, { format: { pretty: true } });
        }
    }

    constructor(private cd: ChangeDetectorRef, private petrolService: FuelDataService) {

        this.topValidators = [testCrossFormGroupValidator()];
    }

    ngOnInit() {
        this.petrolService.getFuelData()
            .subscribe((fuelData: FuelData) => {
                this.fuelData = fuelData;
            });
    }

    // TODO check if there is a better way to avoid error ExpressionChangedAfterItHasBeenCheckedError (comment line to see the error)
    ngAfterViewInit() {
        this.cd.detectChanges();
    }

    /**
     * Gets a reference to the dynamic form group (for example to manually add extra non-dynamic controls).
     */
    retrieveFormGroup(formGroup: FormGroup) {
        this.parentForm = formGroup;
    }

    submit() {
        alert('Nothing here yet!');
    }

}

// testing cross form group validation
export function testCrossFormGroupValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // TODO form model is not type-safe so for the moment and since form model === data model we can cast to data model for type safety
        const fuelData = control.value as FuelData;
        if (fuelData.nestedFormValidation && fuelData.contacts) {
            return fuelData.nestedFormValidation.testField1 === fuelData.contacts.organisationResponsibleForReport
                ? null
                : { 'crossFormGroupError1': 'Test Error' };
        }
        return null;
    };
}

