import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabExamFindingComponent } from './lab-exam-finding';

describe('LabExamFinding', () => {
  let component: LabExamFindingComponent;
  let fixture: ComponentFixture<LabExamFindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabExamFindingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabExamFindingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
