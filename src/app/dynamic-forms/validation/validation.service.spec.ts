import {TestBed} from '@angular/core/testing';

import {ValidationService} from './validation.service';
import {TextboxControl} from '../controls/textbox-control';
import {FormControl, FormGroup, Validators} from '@angular/forms';


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

        const expected = [{
            errorName: 'required',
            errorMessage: ''
        }];
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

        const expected = [{
            errorName: 'required',
            errorMessage: ''
        },
            {
                errorName: 'minlength',
                errorMessage: ''
            }];

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

        const expected = [
            {
                errorName: 'required',
                errorMessage: 'This field is required'
            },
            {
                errorName: 'minlength',
                errorMessage: 'The minimum length is 5'
            }
        ];

        expect(validationMessages).toEqual(expected);
    });

    it('should update form errors correctly for a simple form group with one text box', () => {
        const textboxControl = new TextboxControl({
            key: 'testTextBox1',
            validators: [
                {
                    formError: 'email',
                    validator: Validators.email,
                    validationMessage: 'Incorrect email format'
                },
                {
                    formError: 'minlength',
                    validator: Validators.minLength(5),
                    validationMessage: 'The minimum length is 5'
                }
            ]
        });

        const formControl = new FormControl('', [Validators.email, Validators.minLength(5)]);
        const formGroup = new FormGroup(
            {
                'testTextBox1': formControl
            });
        formGroup.patchValue({'testTextBox1': 'a'});
        formGroup.get('testTextBox1').markAsDirty();

        const formErrorStructure = service.generateFormErrorStructure(textboxControl);
        const validationMessages = service.generateValidationMessages(textboxControl);

        const formErrors = service.updateFormErrors(
            formGroup,
            [{
                controlKey: 'testTextBox1',
                errors: formErrorStructure
            }],
            [{
                controlKey: 'testTextBox1',
                validationTuple: validationMessages
            }]);

        expect(formErrors).toEqual([{
            controlKey: 'testTextBox1',
            errors: [{
                errorName: 'email',
                errorMessage: 'Incorrect email format'
            }, {
                errorName: 'minlength',
                errorMessage: 'The minimum length is 5'
            }]
        }]);
    })
    ;

})
;
