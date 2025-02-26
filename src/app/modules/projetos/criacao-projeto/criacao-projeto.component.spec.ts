import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriacaoProjetoComponent } from './criacao-projeto.component';

describe('CriacaoProjetoComponent', () => {
  let component: CriacaoProjetoComponent;
  let fixture: ComponentFixture<CriacaoProjetoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriacaoProjetoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriacaoProjetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
