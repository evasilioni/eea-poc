import { Component, Input } from '@angular/core';
import { Country } from './country';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Contacts } from './contacts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  countries: Country[];
  contacts: Contacts = new Contacts();
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
    this.filteredCountries = this.countries.filter((country: Country) => country.name.toLowerCase().includes(event.query.toLowerCase()));
  }
}
