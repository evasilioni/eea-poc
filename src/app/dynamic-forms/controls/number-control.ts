import {BaseControl, BaseControlOptions, ControlType} from './base-control';
import { InputControl, InputControlOptions } from './input-control';
import { Validators } from '@angular/forms';

export class NumberControl extends InputControl<string> {
    controlType = ControlType.NUMBER;

    constructor(options: NumberControlOptions<string> = {}) {
        super(options);
        this.validators.push({
            formError: 'number',
            validator: Validators.pattern(/^(0|[1-9][0-9]*)$/i),
            validationMessage: 'Only numbers allowed!'
        });
    }
}

export interface NumberControlOptions<T> extends InputControlOptions<string> {

}


