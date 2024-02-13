/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TchmsgService } from './tchmsg.service';

describe('Service: Tchmsg', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TchmsgService]
    });
  });

  it('should ...', inject([TchmsgService], (service: TchmsgService) => {
    expect(service).toBeTruthy();
  }));
});
