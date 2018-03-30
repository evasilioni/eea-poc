import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {AutoCompleteModule} from 'primeng/autocomplete';


import { AppComponent } from './app.component';
import { ContactsComponent } from './contacts/contacts.component';


@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    InputTextModule,
    FormsModule,
    CardModule,
    AutoCompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
