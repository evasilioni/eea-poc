import {TestBed} from '@angular/core/testing';

import {ValidationService} from './validation.service';
import {TextboxControl} from '../controls/textbox-control';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GroupControl} from '../controls/group-controll';


describe('ValidationService', () => {
    let service: ValidationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ValidationService]
        });
        service = TestBed.get(ValidationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should generate correct form error structure for required validator', () => {
        const control = new TextboxControl({
            key: 'testTextBox1',
            validators: [
                {
                    formError: 'required',
                    validator: Validators.required
                }
            ]
        });
        const formErrorStructure = service.generateFormErrorStructure(control);

        const expected = {
            required: ''
        }
        expect(formErrorStructure).toEqual(expected);
    });

    it('should generate correct form error structure for two validators', () => {
        const control = new TextboxControl({
            key: 'testTextBox1',
            validators: [
                {
                    formError: 'required',
                    validator: Validators.required
                },
                {
                    formError: 'minlength',
                    validator: Validators.minLength(5)
                }
            ]
        });
        const formErrorStructure = service.generateFormErrorStructure(control);

        const expected = {
            required: '',
            minlength: ''
        }
        expect(formErrorStructure).toEqual(expected);
    });

    it('should generate validation messages structure for two validators', () => {
        const control = new TextboxControl({
            key: 'testTextBox1',
            validators: [
                {
                    formError: 'required',
                    validator: Validators.required
                },
                {
                    formError: 'minlength',
                    validator: Validators.minLength(5),
                    validationMessage: 'The minimum length is 5'
                }
            ]
        });

        const validationMessages = service.generateValidationMessages(control);

        const expected = {
            required: 'This field is required',
            minlength: 'The minimum length is 5'
        };
        expect(validationMessages).toEqual(expected);
    });

    it('should update form errors correctly for a simple form group with one text box', () => {
        const groupControl = new GroupControl({
            key: 'testFormGroup1',
            groupControls: [
                new TextboxControl({
                    key: 'testTextBox1',
                    validators: [
                        {
                            formError: 'required',
                            validator: Validators.required
                        },
                        {
                            formError: 'minlength',
                            validator: Validators.minLength(5),
                            validationMessage: 'The minimum length is 5'
                        }
                    ]
                })
            ]
        });

        const formControl = new FormControl('', [Validators.required, Validators.minLength(5)]);

        const formGroup = new FormGroup(
            {
                'testTextBox1': formControl
            });
        const formErrorStructure = service.generateFormErrorStructure(groupControl);
        const validationMessages = service.generateValidationMessages(groupControl);

        service.updateFormErrors(formGroup, [formErrorStructure], validationMessages);

        // TODO
    });

});
