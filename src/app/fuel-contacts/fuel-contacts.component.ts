import { Component, Input } from '@angular/core';
import { Contacts, Address } from './fuel-contacts';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Country } from './country';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';

@Component({
    selector: 'fuel-contacts',
    templateUrl: './fuel-contacts.component.html',
    styleUrls: ['./fuel-contacts.component.css']
})
export class FuelContactsComponent {
    fuelContactForm: FormGroup;

    @Input()
    contacts: Contacts;

    countries: Country[];
    filteredCountries: Country[];

    constructor(private http: HttpClient, private fb: FormBuilder) {
        this.getCountries()
            .subscribe((data: Country[]) => {
                this.countries = data;
            });
        // this.createForm();
    }

    // createForm() {
    //     this.fuelContactForm = this.fb.group({ // <-- the parent FormGroup
    //         country: ['', Validators.required],
    //         dateReportCompleted: null,
    //         organisationResponsibleForReport: ['',Validators.required],
    //         organisationAddress: this.fb.group({
    //             street: ['',Validators.required],
    //             city:'',
    //             postcode:['',Validators.minLength(5)]
    //         }),
    //         personResponsibleForReport: '',
    //         personInfo: this.fb.group({ // <-- the child FormGroup
    //             phoneNumber: '',
    //             email: ''
    //         }),
    //         generalSummary: ''
    //     })
    // }

    getCountries(): Observable<Country[]> {
        return this.http.get<Country[]>('./assets/countries.json');
    }

    searchCountries(event) {
        console.log(this.countries);
        this.filteredCountries = this.countries
            .filter((country: Country) => country.name.toLowerCase().includes(event.query.toLowerCase()));
    }

    onSubmit(){
        if(this.fuelContactForm.valid){
            this.contacts = this.prepareSaveFuelContact();
            console.log(this.contacts);
        }else {
            alert('Validations!!!');
        }

    }

    prepareSaveFuelContact(): Contacts {
        const formModel = this.fuelContactForm.value;

        const saveFuelContact: Contacts = {
            country: formModel.country,
            dateReportCompleted: formModel.dateReportCompleted,
            organisationResponsibleForReport: formModel.organisationResponsibleForReport,
            organisationAddress: formModel.organisationAddress,
            personResponsibleForReport: formModel.personResponsibleForReport,
            personInfo: formModel.personInfo,
            generalSummary:  formModel.generalSummary
        }

        return saveFuelContact;
    }

    ngOnInit() {
        this.fuelContactForm = new FormGroup({ // <-- the parent FormGroup
            'country': new FormControl(this.contacts.country, [Validators.required]),
            'dateReportCompleted': new FormControl(this.contacts.dateReportCompleted),
            'organisationResponsibleForReport': new FormControl(this.contacts.organisationResponsibleForReport,[
                        Validators.required, 
                        forbiddenNameValidator(/Alex/i)
                    ]),
            'organisationAddress': new FormGroup({
                street: new FormControl('', [Validators.required]),
                city:new FormControl('', [Validators.required]),
                postcode: new FormControl('', [Validators.minLength(5)])
            }),
            'personResponsibleForReport': new FormControl(''),
            'personInfo': new FormGroup({
                'phoneNumber': new FormControl(''),
                'email': new FormControl('')
            }),
            'generalSummary': new FormControl(this.contacts.generalSummary)
        })
    }

    get country() { return this.fuelContactForm.get('country'); }
    get organisationResponsibleForReport() { return this.fuelContactForm.get('organisationResponsibleForReport'); }
    get postcode() { return this.fuelContactForm.get('postcode'); }
}

export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const forbidden = nameRe.test(control.value);
        return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
}
