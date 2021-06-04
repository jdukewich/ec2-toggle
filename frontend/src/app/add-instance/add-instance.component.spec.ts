import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInstanceComponent } from './add-instance.component';

describe('AddInstanceComponent', () => {
  let component: AddInstanceComponent;
  let fixture: ComponentFixture<AddInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInstanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
