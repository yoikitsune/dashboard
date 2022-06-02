import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumStatusComponent } from './medium-status.component';

describe('MediumStatusComponent', () => {
  let component: MediumStatusComponent;
  let fixture: ComponentFixture<MediumStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediumStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediumStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
