import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms'; // <-- #1 import module
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CardModule} from 'primeng/card';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {TabViewModule} from 'primeng/tabview';
import {CalendarModule} from 'primeng/calendar';
import {TableModule} from 'primeng/table';
import {DialogModule, MessagesModule} from 'primeng/primeng';

import {AppComponent} from './app.component';
import {NgFormInputComponent} from './helpers/ng-form-input/ng-form-input.component';
import {FuelContactsComponent} from './fuel-contacts/fuel-contacts.component';
import {FuelPetrolComponent} from './fuel-petrol/fuel-petrol.component';

import {SampleFrequencyComponent} from './fuel-petrol/sample-frequency/sample-frequency.component';
import {DynamicFormsModule} from './dynamic-forms/dynamic-forms.module';
import {FuelContactsService} from './fuel-contacts/fuel-conacts.service';
import {ReportingResultsComponent} from './fuel-petrol/reporting-results/reporting-results.component';
import {ReportingResultComponent} from './fuel-petrol/reporting-results/reporting-result/reporting-result.component';
import {FuelPetrolService} from './fuel-petrol/fuel-petrol.service';
import {FuelPetrolTabComponent} from './fuel-petrol/fuel-petrol-tab/fuel-petrol-tab.component';
import {FuelDataService} from './fuel-data.service';
import {ConfigService} from './config.service';


@NgModule({
    declarations: [
        AppComponent,
        NgFormInputComponent,
        FuelContactsComponent,
        FuelPetrolComponent,
        SampleFrequencyComponent,
        ReportingResultsComponent,
        ReportingResultComponent,
        FuelPetrolTabComponent
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
        CalendarModule,
        DynamicFormsModule,
        MessagesModule,
        TableModule,
        DialogModule
    ],
    providers: [FuelContactsService, FuelDataService, ConfigService, FuelPetrolService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
