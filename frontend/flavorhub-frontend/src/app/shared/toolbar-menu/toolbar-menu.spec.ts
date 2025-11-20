import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarMenu } from './toolbar-menu';

describe('ToolbarMenu', () => {
  let component: ToolbarMenu;
  let fixture: ComponentFixture<ToolbarMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
