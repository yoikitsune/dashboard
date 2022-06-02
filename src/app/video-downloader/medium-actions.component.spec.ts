import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumMenuComponent } from './medium-menu.component';

describe('MediumMenuComponent', () => {
  let component: MediumMenuComponent;
  let fixture: ComponentFixture<MediumMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediumMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediumMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
