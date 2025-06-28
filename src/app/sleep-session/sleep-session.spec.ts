import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SleepSession } from './sleep-session';

describe('SleepSession', () => {
  let component: SleepSession;
  let fixture: ComponentFixture<SleepSession>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SleepSession]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SleepSession);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
