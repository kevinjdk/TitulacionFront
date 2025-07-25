import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatoFormComponent } from './plato-form.component';

describe('PlatoFormComponent', () => {
  let component: PlatoFormComponent;
  let fixture: ComponentFixture<PlatoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlatoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
