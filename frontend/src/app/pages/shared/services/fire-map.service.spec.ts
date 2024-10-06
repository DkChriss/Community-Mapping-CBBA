/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FireMapService } from './fire-map.service';

describe('Service: FireMap', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FireMapService]
    });
  });

  it('should ...', inject([FireMapService], (service: FireMapService) => {
    expect(service).toBeTruthy();
  }));
});
