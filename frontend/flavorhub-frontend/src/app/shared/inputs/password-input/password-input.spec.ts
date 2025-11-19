import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordINput } from './password-input';

describe('PasswordINput', () => {
  let component: PasswordINput;
  let fixture: ComponentFixture<PasswordINput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordINput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordINput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
