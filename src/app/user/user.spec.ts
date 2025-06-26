import { TestBed } from '@angular/core/testing';
import { UserComponent } from './user';

describe('UserComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UserComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});