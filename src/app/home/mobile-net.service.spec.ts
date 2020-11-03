import { TestBed } from '@angular/core/testing';

import { MobileNetService } from './mobile-net.service';

describe('MobileNetService', () => {
  let service: MobileNetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobileNetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
