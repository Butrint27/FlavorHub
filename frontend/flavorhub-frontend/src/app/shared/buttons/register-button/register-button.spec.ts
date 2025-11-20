import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterButton } from './register-button';

describe('RegisterButton', () => {
  let component: RegisterButton;
  let fixture: ComponentFixture<RegisterButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
