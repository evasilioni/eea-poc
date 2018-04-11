import {TestBed} from '@angular/core/testing';

import {DynamicFormService} from './dynamic-form.service';
import {TextboxControl} from '../controls/textbox-control';
import {FormGroup} from '@angular/forms';

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
    });
});
