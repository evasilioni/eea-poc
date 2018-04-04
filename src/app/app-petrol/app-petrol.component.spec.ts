import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPetrolComponent } from './app-petrol.component';

describe('AppPetrolComponent', () => {
  let component: AppPetrolComponent;
  let fixture: ComponentFixture<AppPetrolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPetrolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPetrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
