import { TestBed, inject } from '@angular/core/testing';

import { SessionStadisticsService } from './session-stadistics.service';

describe('SessionStadisticsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionStadisticsService]
    });
  });

  it('should be created', inject([SessionStadisticsService], (service: SessionStadisticsService) => {
    expect(service).toBeTruthy();
  }));
});
