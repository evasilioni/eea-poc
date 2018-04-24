import {TestBed} from '@angular/core/testing';

import {DynamicFormService} from './dynamic-form.service';
import {TextboxControl} from '../controls/textbox-control';
import {FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, FormArray} from '@angular/forms';
import {GroupControl} from '../controls/group-controll';
import { ArrayControl } from '../controls/array-control';

let service: DynamicFormService;

fdescribe('DynamicFormService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DynamicFormService]
        });
        service = TestBed.get(DynamicFormService);
    });

    it('should be created', function () {
        expect(service).toBeTruthy();
    });

    describe('Create Dynamic Form Group', () => {

        it('should create form group with one text box inside parent form', function () {
            const parentFormGroup = new FormGroup({});
            service.toFormGroup([
                    new TextboxControl({
                        key: 'testTextBox',
                        label: 'testLabel'
                    })
                ],
                [],
                [],
                'testGroup',
                parentFormGroup
            );
            const testGroup = parentFormGroup.get('testGroup') as FormGroup;
            expect(testGroup).toBeDefined();
            expect(Object.keys(testGroup.controls).length).toEqual(1);

            const testTextBox = testGroup.get('testTextBox');
            expect(testTextBox.valid).toBeTruthy();

        });

        it('should throw error when no key is provided in control', function () {
            const parentFormGroup = new FormGroup({});
            expect(
                function () {
                    service.toFormGroup([
                            new TextboxControl({
                                label: 'testLabel'
                            })
                        ],
                        [],
                        [],
                        'testGroup',
                        parentFormGroup
                    );
                }
            ).toThrow();
        });

        it('should validate form group with one text box and a required validator', function () {
            const parentFormGroup = new FormGroup({});
            service.toFormGroup([
                    new TextboxControl({
                        key: 'testTextBox',
                        label: 'testLabel',
                        validators: [
                            {
                                formError: 'required',
                                validator: Validators.required
                            }
                        ]
                    })
                ],
                [],
                [],
                'testGroup',
                parentFormGroup
            );
            const formControl = parentFormGroup.get('testGroup').get('testTextBox') as FormControl;
            // for some reason a form starts in invalid state
            expect(formControl.valid).toBeFalsy();
            expect(formControl.dirty).toBeFalsy();
            formControl.setValue('test');
            expect(formControl.valid).toBeTruthy();
        });

        it('should skip creation of nested form group (creation is done recursively)', function () {
            const parentFormGroup = new FormGroup({});
            service.toFormGroup([
                    new GroupControl({
                        key: 'nestedFormGroup',
                        groupControls: [
                            new TextboxControl({
                                key: 'testTextBox',
                                label: 'testLabel'
                            })
                        ]
                    })
                ],
                [],
                [],
                'testGroup',
                parentFormGroup
            );

            const topFormGroup = parentFormGroup.get('testGroup') as FormGroup;
            const nestedFormGroup = topFormGroup.get('nestedFormGroup') as FormGroup;
            expect(nestedFormGroup).toBeNull();
        });

        fit('should create FormArray with validators from ArrayControl', function () {
            
            const arrayControl = new ArrayControl({
                key: 'petrols',
                arrayControls: [
                    new GroupControl({
                        key: 'petrol1',
                        groupControls: [
                            new TextboxControl({
                                key: 'testTextBox1',
                                label: 'testLabel1'
                            })
                        ],
                        groupValidators: [
                            forbiddenNameValidator(/EEE/i)
                        ]
                    }),
                    new GroupControl({
                        key: 'petrol2',
                        groupControls: [
                            new TextboxControl({
                                key: 'testTextBox2',
                                label: 'testLabel2'
                            })
                        ]
                    })
                ],
                arrayValidators: [
                    forbiddenNameValidator(/EEA/i)
                ]
            });
            const formGroup = service.toFormGroup([arrayControl], [], []);
            
            expect(formGroup.get('petrols') instanceof FormArray).toBeTruthy();
            const fomrArray = formGroup.get('petrols') as FormArray;
            expect(fomrArray.controls.length).toEqual(2);
            expect(fomrArray.validator).not.toBeNull();
            expect(fomrArray.controls[0].validator).not.toBeNull();
            expect(fomrArray.controls[1].validator).toBeNull();
        });
    });
});

export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const forbidden = nameRe.test(control.value);
        return forbidden ? {'forbiddenName': {value: control.value}} : null;
    };
}
