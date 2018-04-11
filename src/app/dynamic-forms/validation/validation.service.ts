import {Injectable} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {BaseControl} from '../controls/base-control';

export const defaultValidationMessages = {
    'required': 'This field is required',
    'minlength': 'Minimum length is ${minLength}'
};

@Injectable()
export class ValidationService {

    constructor() {
    }

    /**
     * Generates object of the form:
     *
     *  controlKey: {
     *      errorKey1: '',
     *      errorKey2: ''
     *  }
     *
     * This is the object were the error messages will be stored, per control and per error type (key) when validation is performed
     */
    generateFormErrorStructure(control: BaseControl<any>) {
        var reduce = control.validators
            .map(validator => validator.formError)
            .reduce((o, key) => ({...o, [key]: ''}), {});
        console.log(control.key, reduce);
        return reduce;
    }

    /**
     * Generates object of the form:
     *
     * controlKey: {
     *      errorKey1: validationMessage1,
     *      errorKey2: validationMessage2
     * }
     *
     * This object is used to select which validation messages will be shown
     */
    generateValidationMessages(control: BaseControl<any>) {
        return control.validators
            .reduce((o, key) => ({...o, [key.formError]: this.getValidationMessages(key)}), {});
    }

    updateFormErrors(form: FormGroup, formErrors: any[], validationMessages: any): any[] {
        Object.keys(formErrors).map(field => {
            // clear previous error message (if any)
            formErrors[field] = '';
            const control = form.get(field);
            if (!(control instanceof FormGroup) && this.isControlInvalid(control)) {
                const messages = validationMessages[field];
                Object.keys(control.errors).map(key => {
                    formErrors[field] += messages[key] + ' ';
                });
            }
        });
        // TODO form (not field) errors
        // if (form && form.dirty && !form.valid && form.errors) {
        //     Object.keys(form.errors).map(key => {
        //         const messages = defaultValidationMessages[key];
        //         this.formErrors[key] += messages[form.errors[key]] + ' ';
        //     });
        // }
        return formErrors;
    }

// if a validation message is not passed in the control, a default one is selected
    private getValidationMessages(key) {
        return !!key.validationMessage ? key.validationMessage : defaultValidationMessages[key.formError];
    }

    private isControlInvalid(control: AbstractControl) {
        return control && control.dirty && !control.valid && control.enabled;
    }
}
