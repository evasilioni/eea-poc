import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReactiveFormsModule} from '@angular/forms';
import {DynamicFormComponent} from './dynamic-form/dynamic-form.component';
import {DynamicFormService} from './dynamic-form/dynamic-form.service';
import {DynamicFormControlComponent} from './dynamic-form-control/dynamic-form-control.component';
import {ButtonModule} from 'primeng/button';
import {AutoCompleteModule, InputTextModule, MessagesModule, TabViewModule} from 'primeng/primeng';
import {ErrorMessagesComponent} from './error-messages/error-messages.component';
import {ValidationService} from './validation/validation.service';
import {RelationService} from './relation/relation.service';
import {CalendarModule} from 'primeng/calendar';
import {TabFormDirective} from './tab-form.directive';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        AutoCompleteModule,
        InputTextModule,
        MessagesModule,
        CalendarModule,
        TabViewModule
    ],
    declarations: [DynamicFormControlComponent, DynamicFormComponent, ErrorMessagesComponent, TabFormDirective],
    providers: [DynamicFormService, ValidationService, RelationService],
    exports: [DynamicFormComponent, DynamicFormControlComponent, ErrorMessagesComponent, TabFormDirective]
})
export class DynamicFormsModule {

}
