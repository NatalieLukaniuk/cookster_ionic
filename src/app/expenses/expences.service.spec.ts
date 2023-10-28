import { TestBed } from '@angular/core/testing';

import { ExpencesService } from './expences.service';

describe('ExpencesService', () => {
  let service: ExpencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
