import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLancamentoHorasComponent } from './view-lancamento-horas.component';

describe('ViewLancamentoHorasComponent', () => {
  let component: ViewLancamentoHorasComponent;
  let fixture: ComponentFixture<ViewLancamentoHorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLancamentoHorasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLancamentoHorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
