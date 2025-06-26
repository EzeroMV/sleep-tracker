import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SleepQuality } from './sleep-quality';

describe('SleepQuality', () => {
  let component: SleepQuality;
  let fixture: ComponentFixture<SleepQuality>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SleepQuality]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SleepQuality);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
