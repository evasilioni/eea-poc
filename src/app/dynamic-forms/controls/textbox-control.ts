import {BaseControl, BaseControlOptions, ControlType} from './base-control';
import { InputControl, InputControlOptions } from './input-control';

export class TextboxControl extends InputControl<string> {

    constructor(options: TextBoxControlOptions<string> = {}) {
        super(options);
    }
}

export interface TextBoxControlOptions<T> extends InputControlOptions<string> {
}

