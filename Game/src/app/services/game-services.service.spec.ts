import { TestBed, inject } from '@angular/core/testing';

import { GameServicesService } from './game-services.service';

describe('GameServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameServicesService]
    });
  });

  it('should be created', inject([GameServicesService], (service: GameServicesService) => {
    expect(service).toBeTruthy();
  }));
});
