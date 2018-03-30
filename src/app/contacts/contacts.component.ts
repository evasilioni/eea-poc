import { Component, OnInit, Input } from '@angular/core';
import { Country } from './country';
import { Contacts } from './contacts';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

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
    return this.http.get<Country[]>("./assets/countries.json");
  }

  searchCountries(event) {
    console.log(this.countries);
    this.filteredCountries = this.countries
      .filter((country: Country) => country.name.toLowerCase().includes(event.query.toLowerCase()));
  }

  ngOnInit() {
  }

}
