import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLancamentoHorasComponent } from './edit-lancamento-horas.component';

describe('EditLancamentoHorasComponent', () => {
  let component: EditLancamentoHorasComponent;
  let fixture: ComponentFixture<EditLancamentoHorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLancamentoHorasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLancamentoHorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
