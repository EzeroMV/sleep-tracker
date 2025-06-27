import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SleepFactors } from './sleep-factors';

describe('SleepFactors', () => {
  let component: SleepFactors;
  let fixture: ComponentFixture<SleepFactors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SleepFactors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SleepFactors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
