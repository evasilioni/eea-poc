import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BaseControl, ControlType} from '../controls/base-control';
import {FormError} from '../validation/form-error';


@Component({
    selector: 'dynamic-form-control',
    templateUrl: './dynamic-form-control.component.html',
    styleUrls: ['./dynamic-form-control.component.css']
})
export class DynamicFormControlComponent implements OnInit {


    @Input() control: BaseControl<any>;

    @Input() form: FormGroup;

    @Input() controlErrors: FormError;

    @Input() labelCssClasses: string[];

    @Input() elementCssClasses: string[];

    @Input() controlsPerRow: number;

    @HostBinding('class') hostClasses: string;

    // only way to use enum in angular template...
    // https://stackoverflow.com/questions/42464367/angular2-use-enum-value-in-html-value-attribute/
    ControlType = ControlType;

    ngOnInit() {
        this.hostClasses = this.calculateHostClasses();
    }

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

    hasErrors() {
        return this.controlErrors.errors.find(error => error.errorName !== '');
    }

    getErrorMessages() {
        return this.controlErrors.errors.map(error => error.errorMessage).join('<br>');
    }

    private calculateHostClasses() {
        let classes = '';
        switch (this.controlsPerRow) {
            case 1: {
                classes = 'ui-g-12 ui-sm-12';
                break;
            }
            case 2: {
                classes = 'ui-g-6 ui-sm-12';
                break;
            }
            case 3: {
                classes = 'ui-g-4 ui-sm-12';
                break;
            }
            case 4: {
                classes = 'ui-g-3 ui-sm-12';
                break;
            }

            case 6: {
                classes = 'ui-g-2 ui-sm-12';
                break;
            }
            default: {
                classes = 'ui-g-12 ui-sm-12';
                break;
            }
        }
        return classes;
    }
}


