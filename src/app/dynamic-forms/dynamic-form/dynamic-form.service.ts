import {Injectable} from '@angular/core';

import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
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
                validators: ValidatorFn[], nameInParent?: string, parent?: AbstractControl) {
        const group: any = {};

        controls
            .filter(control => control.controlType !== ControlType.GROUP)
            .concat(customControls)
            .forEach(control => this.createControl(group, control));

        const formGroup = new FormGroup(group, validators);
        if (parent) {
            this.addToParent(parent, nameInParent, formGroup);
        }
        return formGroup;
    }

    /**
     * Groups controls in rows (for the desired number of elements per row) and also takes care to group separately
     * in case the control is a GROUP or ARRAY
     *
     * @param {BaseControl<string>[]} controls
     * @param {number} controlsPerRow
     * @returns {BaseControl<string>[][]}
     */
    groupControls(controls: BaseControl<string>[], controlsPerRow: number): BaseControl<string>[][] {
        return this.groupRecursive([], [], controls, controlsPerRow);
    }

    private groupRecursive(groupedControls: BaseControl<string>[][], currentGroup: BaseControl<string>[],
                           controls: BaseControl<string>[], controlsPerRow: number) {

        if (controls.length === 0) {
            // last iteration, add remaining controls in a group
            if (currentGroup.length !== 0) {
                groupedControls.push(currentGroup);
            }
            return groupedControls;
        } else if (controls[0] && (controls[0].controlType === ControlType.GROUP || controls[0].controlType === ControlType.ARRAY)) {
            // case where a group is found we first create new group with previous found controls (if any)
            // then we create a new group with only the GROUP or ARRAY
            // then reset the temporary group array
            if (currentGroup.length !== 0) {
                groupedControls.push(currentGroup);
            }
            groupedControls.push([controls[0]]);
            currentGroup = [];
        } else if (currentGroup.length === controlsPerRow) {
            // case where the temp group array has reached the desired length
            // we created new group but also start a new temp group, in case control[0] is the last of the controls
            groupedControls.push(currentGroup);
            currentGroup = [controls[0]];
        } else {
            // in all other cases we just add to the temp array
            currentGroup.push(controls[0]);
        }
        return this.groupRecursive(groupedControls, currentGroup, controls.slice(1), controlsPerRow);
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
                const group = this.toFormGroup([], groupControl.groupControls, groupControl.groupValidators);
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
        } else if (control instanceof GroupControl) {
            // TODO this is the case where the form array has a nested group. we want it to be created here,
            // since we do not render the array. In case we want an array to be rendered this needs more thought.
            // the groupControls are passe to the customControls parameter for this exact reason
            group[control.key] = this.toFormGroup([], control.groupControls, control.groupValidators, control.key);
        } else {
            group[control.key] = this.createFormControl(control);
        }

    }

    private createFormControl(control) {
        return control.validators
            ? new FormControl({value: control.value, disabled: control.disabled()} || '', this.getValidators(control.validators))
            : new FormControl({value: control.value, disabled: control.disabled()} || '');
    }

    private addToParent(parent: AbstractControl, name: string, formGroup: FormGroup) {
        if (parent instanceof FormGroup) {
            parent.addControl(name, formGroup);
        } else if (parent instanceof FormArray) {
            parent.push(formGroup);
        }
    }

    private getValidators(validators: ValidatorConfig[]): ValidatorFn[] {
        return validators.map((validator) => validator.validator);
    }
}
