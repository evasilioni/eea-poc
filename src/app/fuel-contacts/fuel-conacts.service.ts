import {Injectable} from '@angular/core';

import {AbstractControl, ValidatorFn, Validators} from '@angular/forms';
import {AutocompleteControl} from '../dynamic-forms/controls/autocomplete-control';
import {Observable} from 'rxjs/Observable';
import {Country} from './country';
import {HttpClient} from '@angular/common/http';
import {TextboxControl} from '../dynamic-forms/controls/textbox-control';
import {BaseControl} from '../dynamic-forms/controls/base-control';
import {NestedFormData} from '../fuel-data';
import {GroupControl} from '../dynamic-forms/controls/group-controll';
import { CalendarControl } from '../dynamic-forms/controls/calendar-control';

@Injectable()
export class FuelContactsService {
    private countries: Country[];
    private filteredCountries = {value: []};

    constructor(private http: HttpClient) {
        this.getCountries()
            .subscribe((data: Country[]) => {
                this.countries = data;
            });
    }

    getControls(): BaseControl<any>[] {

        const controls: BaseControl<any>[] = [

            new AutocompleteControl({
                key: 'country',
                label: 'Country',
                order: 1,
                suggestions: this.filteredCountries,
                searchFn: this.searchCountries,
                suggestionField: 'name',
                validators: [
                    {formError: 'required', validator: Validators.required, validationMessage: 'country'},
                ]

            }),

            new CalendarControl({
                key: 'dateReportCompleted',
                label: 'Date Report Completed',
                order: 2,
                dateFormat: 'dd/mm/y',
                showIcon: true
            }),

            new TextboxControl({
                key: 'organisationResponsibleForReport',
                label: 'Organisation',
                order: 3,
                validators: [
                    {
                        formError: 'required',
                        validator: Validators.required,
                        validationMessage: 'Organisation'
                    },
                    {
                        formError: 'forbiddenName',
                        validator: forbiddenNameValidator(/EEA/i),
                        validationMessage: 'Organisation responsible for report cannot be EEA'
                    }
                ]
            }),

            new GroupControl({
                key: 'organisationAddress',
                order: 4,
                controlsPerRow: 2,
                groupControls: [
                    new TextboxControl({
                        key: 'address',
                        label: 'Address Of Organisation Street',
                        order: 1
                    }),
                    new TextboxControl({
                        key: 'city',
                        label: 'City',
                        order: 2
                    }),
                    new TextboxControl({
                        key: 'postCode',
                        label: 'Post Code',
                        order: 3,
                        validators: [
                            {
                                formError: 'minlength',
                                validator: Validators.minLength(5),
                                validationMessage: 'Minimum length is 5'
                            }
                        ]
                    }),
                ]
            }),

            new TextboxControl({
                key: 'personResponsibleForReport',
                label: 'Person Responsible for Report',
                order: 5
            }),

            new GroupControl({
                key: 'personInfo',
                order: 6,
                controlsPerRow: 2,
                groupControls: [
                    new TextboxControl({
                        key: 'telephoneNumber',
                        label: 'Telephone Number',
                        order: 1
                    }),

                    new TextboxControl({
                        key: 'email',
                        label: 'Email',
                        order: 2
                    })
                ]
            })

        ];

        return controls.sort((a, b) => a.order - b.order);
    }

    getCountries(): Observable<Country[]> {
        return this.http.get<Country[]>('./assets/countries.json');
    }

    searchCountries = (event) => {
        return this.countries
            .filter((country: Country) => country.name.toLowerCase().includes(event.query.toLowerCase()));
    }
}

export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const forbidden = nameRe.test(control.value);
        return forbidden ? {'forbiddenName': {value: control.value}} : null;
    };
}

