import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullnameInput } from './fullname-input';

describe('FullnameInput', () => {
  let component: FullnameInput;
  let fixture: ComponentFixture<FullnameInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullnameInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullnameInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
