import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DynamicFormComponent} from './dynamic-form.component';
import {AutoCompleteModule, InputTextModule, MessagesModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/button';
import {ReactiveFormsModule} from '@angular/forms';
import {DynamicFormControlComponent} from '../dynamic-form-control/dynamic-form-control.component';
import {DynamicFormService} from './dynamic-form.service';
import {ErrorMessagesComponent} from '../error-messages/error-messages.component';
import {ValidationService} from '../validation/validation.service';
import {RelationService} from '../relation/relation.service';

xdescribe('DynamicFormComponent', () => {
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
                MessagesModule
            ],
            providers: [DynamicFormService, ValidationService, RelationService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFormComponent);
        component = fixture.componentInstance;
        component.formName = 'testForm1';
        component.controls = [];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
