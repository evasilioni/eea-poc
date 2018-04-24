import {inject, TestBed} from '@angular/core/testing';

import {PetrolService} from './petrol.service';

xdescribe('PetrolService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PetrolService]
        });
    });

    it('should be created', inject([PetrolService], (service: PetrolService) => {
        expect(service).toBeTruthy();
    }));
});
