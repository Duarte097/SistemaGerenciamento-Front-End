import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriacaoAtividadeComponent } from './criacao-atividade.component';

describe('CriacaoAtividadeComponent', () => {
  let component: CriacaoAtividadeComponent;
  let fixture: ComponentFixture<CriacaoAtividadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriacaoAtividadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriacaoAtividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
