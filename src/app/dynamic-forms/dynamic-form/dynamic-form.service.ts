import {Injectable} from '@angular/core';

import {FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {BaseControl, ControlType} from '../controls/base-control';
import {ValidatorConfig} from '../validation/validator-config';

interface DynamicFormServiceOptions {
    toFormGroup(controls: BaseControl<any>[], customControls: BaseControl<any>[], validators: ValidatorFn[], nameInParent?: string, parentFormGroup?: FormGroup): FormGroup;
}

@Injectable()
export class DynamicFormService implements DynamicFormServiceOptions {

    constructor() {
    }

    toFormGroup(controls: BaseControl<any>[], customControls: BaseControl<any>[],
                validators: ValidatorFn[], nameInParent?: string, parentFormGroup?: FormGroup) {
        const group: any = {};

        controls.concat(customControls)
            .filter(control => control.controlType !== ControlType.GROUP)
            .forEach(control => this.createFormControl(group, control));

        const formGroup = new FormGroup(group, validators);
        if (parentFormGroup) {
            this.addToParent(parentFormGroup, nameInParent, formGroup);
        }
        return formGroup;
    }

    /**
     * Creates FormControl with its validators (if present).
     */
    private createFormControl(group: any, control) {
        group[control.key] = control.validators
            ? new FormControl(control.value || '', this.getValidators(control.validators))
            : new FormControl(control.value || '');
    }

    private addToParent(parentFormGroup: FormGroup, name: string, formGroup: FormGroup) {
        parentFormGroup.addControl(name, formGroup);
    }

    private getValidators(validators: ValidatorConfig[]): ValidatorFn[] {
        return validators.map((validator) => validator.validator);
    }
}
