import { TestBed, inject } from '@angular/core/testing';

import { OnlinePlayersService } from './online-players.service';

describe('OnlinePlayersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnlinePlayersService]
    });
  });

  it('should be created', inject([OnlinePlayersService], (service: OnlinePlayersService) => {
    expect(service).toBeTruthy();
  }));
});
