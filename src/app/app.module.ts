import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';  // <-- #1 import module
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CardModule} from 'primeng/card';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {TabViewModule} from 'primeng/tabview';
import {CalendarModule} from 'primeng/calendar';

import {AppComponent} from './app.component';
import {NgFormInputComponent} from './helpers/ng-form-input/ng-form-input.component';
import {FuelContactsComponent} from './fuel-contacts/fuel-contacts.component';


@NgModule({
    declarations: [
        AppComponent,
        NgFormInputComponent,
        FuelContactsComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        InputTextModule,
        InputTextareaModule,
        ReactiveFormsModule,
        CardModule,
        AutoCompleteModule,
        TabViewModule,
        CalendarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
