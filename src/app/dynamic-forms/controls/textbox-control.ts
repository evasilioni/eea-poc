import {BaseControl, BaseControlOptions, ControlType} from './base-control';

export class TextboxControl extends BaseControl<string> {
    controlType = ControlType.TEXT;

    // type: InputType;

    constructor(options: TextBoxControlOptions<string> = {}) {
        super(options);
        // this.type = options.type || InputType.TEXT;
    }
}

export interface TextBoxControlOptions<T> extends BaseControlOptions<string> {
    // type?: InputType;
}

// export enum InputType {
//     TEXT = 'text',
//     RADIO = 'radio',
//     // ...
// }
