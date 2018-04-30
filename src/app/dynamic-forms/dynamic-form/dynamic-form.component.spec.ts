import {async, ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {DynamicFormComponent} from './dynamic-form.component';
import {AutoCompleteModule, CalendarModule, InputTextModule, MessagesModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/button';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import {DynamicFormControlComponent} from '../dynamic-form-control/dynamic-form-control.component';
import {DynamicFormService} from './dynamic-form.service';
import {ErrorMessagesComponent} from '../error-messages/error-messages.component';
import {ValidationService} from '../validation/validation.service';
import {RelationService} from '../relation/relation.service';
import {TextboxControl} from '../controls/textbox-control';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ArrayControl} from '../controls/array-control';

fdescribe('DynamicFormComponent', () => {
    let component: DynamicFormComponent;
    let fixture: ComponentFixture<DynamicFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DynamicFormComponent, DynamicFormControlComponent, ErrorMessagesComponent],
            imports: [
                ReactiveFormsModule,
                ButtonModule,
                AutoCompleteModule,
                InputTextModule,
                MessagesModule,
                CalendarModule
            ],
            providers: [DynamicFormService, ValidationService, RelationService,
                {provide: ComponentFixtureAutoDetect, useValue: true}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFormComponent);
        component = fixture.componentInstance;
        component.formName = 'testForm1';
        component.controls = [];
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });


    it('should render correctly a text box with its label', () => {
        component.controls = [
            new TextboxControl({
                key: 'testTextBox',
                label: 'testLabel'
            })
        ];

        initComponent();

        const dynamicFormComponent: DebugElement = fixture.debugElement;

        const dynamicFormControlElement: DebugElement = dynamicFormComponent.query(By.css('dynamic-form-control'));

        expect(dynamicFormControlElement).toBeDefined();

        const labelElement: DebugElement = dynamicFormComponent.query(By.css('label'));

        expect(labelElement).toBeDefined();
        expect(labelElement.nativeElement.innerText).toEqual('testLabel:');
        expect(labelElement.attributes.for).toEqual('testTextBox');

        const inputElement = dynamicFormComponent.query(By.css('input'));

        expect(inputElement.attributes.type).toEqual('text');
        expect(inputElement.properties.id).toEqual('testTextBox');

    });

    it('should render two elements side by side when controlsPerRow is 2', () => {
        component.controls = [
            new TextboxControl({
                key: 'testTextBox',
                label: 'testLabel'
            }),
            new TextboxControl({
                key: 'testTextBox1',
                label: 'testLabel1'
            })
        ];
        component.controlsPerRow = 2;

        initComponent();

        const dynamicFormComponent: DebugElement = fixture.debugElement;
        const dynamicFormControlElements: DebugElement[] = dynamicFormComponent.queryAll(By.css('dynamic-form-control'));

        expect(dynamicFormControlElements.length).toEqual(2);
        dynamicFormControlElements.map(control => control.properties).forEach(properties => {
            expect(properties.className).toContain('ui-g-6');
        });
        expect(dynamicFormControlElements[0].parent).toEqual(dynamicFormControlElements[1].parent);
        expect(dynamicFormControlElements[0].parent.attributes.class).toContain('ui-g');
        expect(dynamicFormControlElements[1].parent.attributes.class).toContain('ui-g');
        expect(dynamicFormControlElements[1].parent.attributes.class).toContain('ui-g');


    });

    it('should contain validation error when text field is invalid', fakeAsync(() => {
        component.controls = [
            new TextboxControl({
                key: 'testTextBox',
                label: 'testLabel',
                validators: [
                    {
                        formError: 'minlength',
                        validator: Validators.minLength(5),
                        validationMessage: 'Min length is 5'
                    }
                ]
            })
        ];

        initComponent();

        const dynamicFormComponent: DebugElement = fixture.debugElement;
        const input: HTMLInputElement = dynamicFormComponent.nativeElement.querySelector('input');
        input.value = '11';

        // dispatch a DOM event so that Angular learns of input value change.
        input.dispatchEvent(new Event('input'));

        // fake async
        tick(5000);

        expect(dynamicFormComponent.query(By.css('div.alert-danger'))).toBeTruthy();

    }));

    it('should not render array controls', () => {

        component.controls = [
            new ArrayControl({
                key: 'testArray',
                arrayControls: [
                    new TextboxControl({
                        key: 'testTextbox1',
                        label: 'testTextbox1'
                    })
                ]
            })
        ];

        initComponent();

        const dynamicFormComponent: DebugElement = fixture.debugElement;
        const label: HTMLInputElement = dynamicFormComponent.nativeElement.querySelector('label');
        const control: HTMLInputElement = dynamicFormComponent.nativeElement.querySelector('dynamic-form-control');

        expect(label).toBeNull();
        expect(control).toBeNull();
    });

    const initComponent = function () {
        component.ngOnInit();
        fixture.detectChanges();
    };

});
