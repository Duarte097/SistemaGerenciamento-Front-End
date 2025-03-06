import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriacaoUsuariosComponent } from './criacao-usuarios.component';

describe('CriacaoUsuariosComponent', () => {
  let component: CriacaoUsuariosComponent;
  let fixture: ComponentFixture<CriacaoUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriacaoUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriacaoUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
