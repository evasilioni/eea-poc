import {Component, Input, OnInit} from '@angular/core';
import {Message} from 'primeng/api';
import {FormGroup} from '@angular/forms';
import {debounceTime} from 'rxjs/operators/debounceTime';

@Component({
    selector: 'error-messages',
    templateUrl: './error-messages.component.html',
    styleUrls: ['./error-messages.component.css']
})
export class ErrorMessagesComponent implements OnInit {

    @Input() relatedForm: FormGroup;

    @Input() showNestedErrors: boolean;

    errorMessages;

    constructor() {

    }

    ngOnInit() {
        this.relatedForm.valueChanges
            .pipe(debounceTime(300))
            .subscribe(value => this.errorMessages = this.getErrorMessages());
        this.errorMessages = this.getErrorMessages();
    }

    private getErrorMessages(): Message[] {
        const allErrors: Message[] = [];
        if (this.showNestedErrors) {
            allErrors.push(...this.retrieveChildErrors([], this.relatedForm));
        }
        allErrors.push(...this.getErrors(this.relatedForm));
        return allErrors;
    }

    private getErrors(form: FormGroup): Message[] {
        if (form.errors) {
            return Object.keys(form.errors)
                .map(keyError => this.createErrorMessage(form, keyError));
        }
    }

    private retrieveChildErrors(errors: Message[], formGroup: FormGroup): Message[] {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.controls[key];
            if (control instanceof FormGroup) {
                const errorsToPush = this.getErrors(control);

                errors.push(...errorsToPush);
                this.retrieveChildErrors(errors, control as FormGroup);
            }
        });
        return errors;
    }

    private createErrorMessage(form: FormGroup, keyError): Message {
        return {
            severity: 'error',
            summary: 'Validation for: '  + keyError + ' failed.',
            detail: 'Error Message: ' + form.errors[keyError]
        };
    }

}
