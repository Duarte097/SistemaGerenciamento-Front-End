import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriacaoLancamentoHorasComponent } from './criacao-lancamento-horas.component';

describe('CriacaoLancamentoHorasComponent', () => {
  let component: CriacaoLancamentoHorasComponent;
  let fixture: ComponentFixture<CriacaoLancamentoHorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriacaoLancamentoHorasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriacaoLancamentoHorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
