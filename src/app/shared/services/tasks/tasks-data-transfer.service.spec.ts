import { TestBed } from '@angular/core/testing';

import { TasksDataTransferService } from './tasks-data-transfer.service';

describe('TasksDataTransferService', () => {
  let service: TasksDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
