import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Petrol} from '../../fuel-petrol/petrol';
import {HttpClient} from '@angular/common/http';
import { FuelPetrol, FuelData } from '../../fuel-data';

@Injectable()
export class FuelDataService {

    constructor(private http: HttpClient) {
    }

    getFuelData(): Observable<FuelData> {
        console.log('Petrol service called');
        return this.http.get<FuelData>('../../assets/fuelData.json');
    }

}
