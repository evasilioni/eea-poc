import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {FuelData} from './fuel-data';
import {parse} from 'js2xmlparser';
import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';
import {TextboxControl} from './dynamic-forms/controls/textbox-control';
import {BaseControl} from './dynamic-forms/controls/base-control';
import {GroupControl} from './dynamic-forms/controls/group-controll';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
    title = 'app';

    fuelData: FuelData = new FuelData();

    parentForm: FormGroup;

    parentControls: BaseControl<any>[];

    topValidators: ValidatorFn[];

    controls: BaseControl<any>[];

    // errorMessages: Message[];

    fuelDataXml() {
        if (this.fuelData !== undefined) {
            return parse('fuel-data', this.fuelData, {format: {pretty: true}});
        }
    }

    constructor(private cd: ChangeDetectorRef) {
        // this.parentForm = new FormGroup({}, [testCrossFormGroupValidator()]);
        this.parentControls = [
            new GroupControl({
                key: 'nestedFormValidation',
                // formName: 'nestedFormValidation',
                groupControls: [
                    new TextboxControl({
                        key: 'testField1',
                        label: 'test text',
                        order: 1,
                    })
                ]
            }),

        ];

        this.topValidators = [testCrossFormGroupValidator()];
        // this.controls = [
        //     new TextboxControl({
        //         key: 'testField1',
        //         label: 'test text',
        //         order: 1,
        //     })
        // ];
        // this.parentForm.valueChanges.subscribe(value => {
        //     this.errorMessages = this.getErrorMessages();
        // });
    }

    //
    // private getErrorMessages(): Message[] {
    //     if (this.parentForm.errors != null) {
    //         return Object.keys(this.parentForm.errors)
    //             .map(keyError => this.createErrorMessage(keyError));
    //     }
    // }
    //
    // private createErrorMessage(keyError) {
    //     return {
    //         severity: 'error',
    //         summary: 'Validation: ' + keyError + ' failed',
    //         detail: 'Error Message: ' + this.parentForm.errors[keyError]
    //     };
    // }

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

}

// testing cross form group validation
export function testCrossFormGroupValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // TODO form model is not type-safe so for the moment and since form model === data model we can cast to data model for type safety
        const fuelData = control.value as FuelData;
        if (fuelData.nestedFormValidation && fuelData.fuelContacts) {
            return fuelData.nestedFormValidation.testField1 === fuelData.fuelContacts.organisationResponsibleForReport
                ? null
                : {'crossFormGroupError1': 'Test Error'};
        }
        return null;
    };
}

