import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Petrol} from '../../fuel-petrol/petrol';
import {HttpClient} from '@angular/common/http';
import { FuelPetrol } from '../../fuel-data';

@Injectable()
export class PetrolService {

    constructor(private http: HttpClient) {
    }

    getFuelPetrol(): Observable<FuelPetrol> {
        console.log('Petrol service called');
        return this.http.get<FuelPetrol>('../../assets/petrols.json');
    }

}
