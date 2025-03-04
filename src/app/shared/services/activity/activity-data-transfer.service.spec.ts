import { TestBed } from '@angular/core/testing';

import { ActivityDataTransferService } from './activity-data-transfer.service';

describe('ActivityDataTransferService', () => {
  let service: ActivityDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
