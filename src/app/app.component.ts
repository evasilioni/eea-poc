import { Component, Input } from '@angular/core';
import { FuelData } from './fuel-data';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  fuelData: FuelData = new FuelData();
}
