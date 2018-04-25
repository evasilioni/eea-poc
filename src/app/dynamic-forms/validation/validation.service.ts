import {Injectable} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {BaseControl} from '../controls/base-control';
import {ErrorTuple, FormError, ValidationErrorMessage} from './form-error';

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
     *  {
     *      errorKey1: '',
     *      errorKey2: ''
     *  }
     *
     * This is the object were the error messages will be stored, per control and per error type (key) when validation is performed
     */
    generateFormErrorStructure(control: BaseControl<any>): ErrorTuple[] {
        return control.validators.map(validator => {
            return {
                errorName: validator.formError,
                errorMessage: ''
            };
        });
        // return control.validators
        //     .map(validator => validator.formError)
        //     .reduce((o, key) => ({...o, [key]: ''}), {});
    }

    /**
     * Generates object of the form:
     *
     * {
     *      errorKey1: validationMessage1,
     *      errorKey2: validationMessage2
     * }
     *
     * This object is used to select which validation messages will be shown for a specific control
     */
    generateValidationMessages(control: BaseControl<any>): ErrorTuple[] {
        return control.validators.map(validator => {
            return {
                errorName: validator.formError,
                errorMessage: this.getValidationMessages(validator)
            };
        });
        // return control.validators
        //     .reduce((o, key) => ({...o, [key.formError]: this.getValidationMessages(key)}), {});
    }

    /**
     * TODO this method maybe incomplete
     *
     * @param {FormGroup} form
     * @param {any[]} formErrors
     * @param validationMessages
     * @returns {any[]}
     */
    updateFormErrors(form: FormGroup, formErrors: FormError[], validationMessages: ValidationErrorMessage[]): FormError[] {
        formErrors.map(formError => formError.controlKey)
            .map(field => {
                // clear previous error message (if any)
                const fieldFormErrors = formErrors.find(error => error.controlKey === field);
                fieldFormErrors.errors = [];
                const fieldMessages = validationMessages.find(v => v.controlKey === field).validationTuple;
                const control = form.get(field);
                if (!(control instanceof FormGroup) && this.isControlInvalid(control)) {
                    Object.keys(control.errors).map(errorName => {
                        fieldFormErrors.errors.push(fieldMessages.find(m => m.errorName === errorName));
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
    private getValidationMessages(key): string {
        return !!key.validationMessage ? key.validationMessage : defaultValidationMessages[key.formError];
    }

    private isControlInvalid(control: AbstractControl) {
        return control && control.dirty && !control.valid && control.enabled;
    }
}
