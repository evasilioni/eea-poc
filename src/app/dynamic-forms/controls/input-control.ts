import {BaseControl, BaseControlOptions, ControlType} from './base-control';

export class InputControl<T> extends BaseControl<string> {
    controlType = ControlType.TEXT;

    constructor(options: InputControlOptions<string> = {}) {
        super(options);
    }
}

export interface InputControlOptions<T> extends BaseControlOptions<string> {
}
