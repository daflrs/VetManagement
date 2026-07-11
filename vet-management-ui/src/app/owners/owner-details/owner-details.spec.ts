import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerDetails } from './owner-details';

describe('OwnerDetails', () => {
  let component: OwnerDetails;
  let fixture: ComponentFixture<OwnerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
