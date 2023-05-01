/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataMappingService } from './data-mapping.service';

describe('Service: DataMapping', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataMappingService]
    });
  });

  it('should ...', inject([DataMappingService], (service: DataMappingService) => {
    expect(service).toBeTruthy();
  }));
});
