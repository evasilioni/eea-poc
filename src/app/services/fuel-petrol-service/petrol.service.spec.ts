import { TestBed, inject } from '@angular/core/testing';

import { PetrolService } from './petrol.service';

describe('PetrolService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PetrolService]
    });
  });

  it('should be created', inject([PetrolService], (service: PetrolService) => {
    expect(service).toBeTruthy();
  }));
});
