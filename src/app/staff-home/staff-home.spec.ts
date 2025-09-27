import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffHome } from './staff-home';

describe('StaffHome', () => {
  let component: StaffHome;
  let fixture: ComponentFixture<StaffHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
