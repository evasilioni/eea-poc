import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BaseControl, ControlType} from '../controls/base-control';


@Component({
    selector: 'dynamic-form-control',
    templateUrl: './dynamic-form-control.component.html',
    styleUrls: ['./dynamic-form-control.component.css']
})
export class DynamicFormControlComponent {


    @Input() control: BaseControl<any>;

    @Input() form: FormGroup;

    @Input() controlErrors: any;

    @Input() labelCssClasses: string[];

    @Input() elementCssClasses: string[];

    // only way to use enum in angular template...
    // https://stackoverflow.com/questions/42464367/angular2-use-enum-value-in-html-value-attribute/
    ControlType = ControlType;

    /**
     * For components that have filtering feature (like auto-complete).
     */
    filter($event) {
        if (this.control['filter']) {
            this.control['filter']($event);
        }
    }

    get isValid(): boolean {
        return this.form.controls[this.control.key].valid;
    }
}


