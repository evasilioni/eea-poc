import {Injectable} from '@angular/core';

import {FormArray, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {BaseControl, ControlType} from '../controls/base-control';
import {ValidatorConfig} from '../validation/validator-config';
import {ArrayControl} from '../controls/array-control';
import {GroupControl} from '../controls/group-controll';


@Injectable()
export class DynamicFormService {

    constructor() {
    }

    /**
     * Creates A FormGroup form an array of controls.
     * If the control is a GroupControl it is not handler here.
     * This will be handled recursively by creating a new dynamic-form element (see dynamic-form.component.html).
     *
     * If required, it also adds the newly created FormGroup to its parent FormGroup.
     *
     * @param {BaseControl<any>[]} controls the controls to render
     * @param {BaseControl<any>[]} customControls the controls to add to the FormGroup but not render
     * @param {ValidatorFn[]} validators the FormGroup validators
     * @param {string} nameInParent the name of the control in the parent FormGroup
     * @param {FormGroup} parentFormGroup the parent FormGroup
     * @returns {FormGroup}
     */
    toFormGroup(controls: BaseControl<any>[], customControls: BaseControl<any>[],
                validators: ValidatorFn[], nameInParent?: string, parentFormGroup?: FormGroup) {
        const group: any = {};

        controls.concat(customControls)
            .filter(control => control.controlType !== ControlType.GROUP)
            .forEach(control => this.createControl(group, control));

        const formGroup = new FormGroup(group, validators);
        if (parentFormGroup) {
            this.addToParent(parentFormGroup, nameInParent, formGroup);
        }
        return formGroup;
    }

    /**
     * Creates a form array from an ArrayControl.
     * In case the array children control is a FormGroup it creates a new FormGroup otherwise a new FormControl.
     *
     * @param {ArrayControl} arrayControl
     * @returns {FormArray}
     */
    private toFormArray(arrayControl: ArrayControl) {
        const formArray = new FormArray([], arrayControl.arrayValidators);

        arrayControl.arrayControls.forEach(control => {

            if (control.controlType === ControlType.GROUP) {
                const groupControl = control as GroupControl;
                const group = this.toFormGroup((control as GroupControl).groupControls, [], groupControl.groupValidators);
                formArray.push(group);
            } else if (control.controlType !== ControlType.ARRAY) {
                formArray.push(this.createFormControl(control));
            }
        });
        return formArray;
    }

    /**
     * Creates a FormArray or FormControl depnedning if the input control is an ArrayControl or not.
     */
    private createControl(group: any, control) {
        if (control instanceof ArrayControl) {
            group[control.key] = this.toFormArray(control);
        } else {
            group[control.key] = this.createFormControl(control);
        }

    }

    private createFormControl(control) {
        return control.validators
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
