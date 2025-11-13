import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C } from './c';

describe('C', () => {
  let component: C;
  let fixture: ComponentFixture<C>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [C]
    })
    .compileComponents();

    fixture = TestBed.createComponent(C);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
