import { TestBed } from '@angular/core/testing';

import { LancamentoHorasDataTransferService } from './lancamento-horas-data-transfer.service';

describe('LancamentoHorasDataTransferService', () => {
  let service: LancamentoHorasDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LancamentoHorasDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
