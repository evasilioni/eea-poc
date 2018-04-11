import {ValidatorFn} from '@angular/forms';
import {BaseControl, BaseControlOptions, ControlType} from './base-control';

export class GroupControl extends BaseControl<string> {
    controlType = ControlType.GROUP;
    // formName: string;
    groupValidators?: ValidatorFn[];
    groupControls: BaseControl<string>[];

    constructor(options: GroupControlOptions<string> = {}) {
        super(options);
        // this.formName = options.formName;
        this.groupValidators = options.groupValidators;
        this.groupControls = options.groupControls;
    }
}

export interface GroupControlOptions<T> extends BaseControlOptions<string> {
    // formName?: string;
    groupValidators?: ValidatorFn[];
    groupControls?: BaseControl<string>[];
}
