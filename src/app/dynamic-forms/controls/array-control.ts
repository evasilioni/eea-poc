import {BaseControl, BaseControlOptions, ControlType} from './base-control';
import {ValidatorFn} from '@angular/forms';

export class ArrayControl extends BaseControl<string> {
    controlType = ControlType.ARRAY;
    arrayValidators?: ValidatorFn[];
    arrayControls?: BaseControl<string>[];

    constructor(options: ArrayControlOptions<string> = {}) {
        super(options);
        this.arrayValidators = options.arrayValidators;
        this.arrayControls = options.arrayControls;
    }
}

export interface ArrayControlOptions<T> extends BaseControlOptions<string> {
    arrayValidators?: ValidatorFn[];
    arrayControls?: BaseControl<string>[];
}
