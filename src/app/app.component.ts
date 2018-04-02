import {Component, Input} from '@angular/core';
import {FuelData} from './fuel-data';
import {parse} from 'js2xmlparser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

    fuelData: FuelData = new FuelData();

    fuelDataXml() {
        if (this.fuelData !== undefined) {
            return parse('fuel-data', this.fuelData, {format: {pretty: true}});
        }
    }
}
