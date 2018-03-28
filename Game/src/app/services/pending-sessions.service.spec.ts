import { TestBed, inject } from '@angular/core/testing';

import { PendingSessionsService } from './pending-sessions.service';

describe('PendingSessionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PendingSessionsService]
    });
  });

  it('should be created', inject([PendingSessionsService], (service: PendingSessionsService) => {
    expect(service).toBeTruthy();
  }));
});
