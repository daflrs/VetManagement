import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentStatusBadge } from './appointment-status-badge';

describe('AppointmentStatusBadge', () => {
  let component: AppointmentStatusBadge;
  let fixture: ComponentFixture<AppointmentStatusBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentStatusBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentStatusBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
