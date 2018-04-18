import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Petrol } from '../../fuel-petrol/petrol';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PetrolService {

  constructor(private http: HttpClient) { }

  getPetrols(): Observable<Petrol[]> {
    console.log("Petrol service called");
    return this.http.get<Petrol[]>("../../assets/petrols.json");
  }

}
