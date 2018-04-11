import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReactiveFormsModule} from '@angular/forms';
import {DynamicFormComponent} from './dynamic-form/dynamic-form.component';
import {DynamicFormService} from './dynamic-form/dynamic-form.service';
import {DynamicFormControlComponent} from './dynamic-form-control/dynamic-form-control.component';
import {ButtonModule} from 'primeng/button';
import {AutoCompleteModule, InputTextModule, MessagesModule} from 'primeng/primeng';
import {ErrorMessagesComponent} from './error-messages/error-messages.component';
import {ValidationService} from './validation/validation.service';
import {RelationService} from './relation/relation.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        AutoCompleteModule,
        InputTextModule,
        MessagesModule
    ],
    declarations: [DynamicFormControlComponent, DynamicFormComponent, ErrorMessagesComponent],
    providers: [DynamicFormService, ValidationService, RelationService],
    exports: [DynamicFormComponent, DynamicFormControlComponent, ErrorMessagesComponent]
})
export class DynamicFormsModule {

}
