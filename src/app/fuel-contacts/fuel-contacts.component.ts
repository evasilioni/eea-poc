import {Component, Input} from '@angular/core';
import {Contacts} from './contacts';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Country} from './country';

@Component({
    selector: 'fuel-contacts',
    templateUrl: './fuel-contacts.component.html',
    styleUrls: ['./fuel-contacts.component.css']
})
export class FuelContactsComponent {

    @Input()
    contacts: Contacts;

    countries: Country[];
    filteredCountries: Country[];

    constructor(private http: HttpClient) {
        this.getCountries()
            .subscribe((data: Country[]) => {
                this.countries = data;
            });
    }

    getCountries(): Observable<Country[]> {
        return this.http.get<Country[]>('./assets/countries.json');
    }

    searchCountries(event) {
        console.log(this.countries);
        this.filteredCountries = this.countries
            .filter((country: Country) => country.name.toLowerCase().includes(event.query.toLowerCase()));
    }

}
