import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffInfo } from './staff-info';

describe('StaffInfo', () => {
  let component: StaffInfo;
  let fixture: ComponentFixture<StaffInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
