import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinciaFormComponent } from './provincia-form.component';

describe('ProvinciaFormComponent', () => {
  let component: ProvinciaFormComponent;
  let fixture: ComponentFixture<ProvinciaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProvinciaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinciaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
