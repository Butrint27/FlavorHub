import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsPlaginator } from './cards-plaginator';

describe('CardsPlaginator', () => {
  let component: CardsPlaginator;
  let fixture: ComponentFixture<CardsPlaginator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsPlaginator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsPlaginator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
