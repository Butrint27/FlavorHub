import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmButton } from './confirm-button';

describe('ConfirmButton', () => {
  let component: ConfirmButton;
  let fixture: ComponentFixture<ConfirmButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
