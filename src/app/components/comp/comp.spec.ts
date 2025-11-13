import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Comp } from './comp';

describe('Comp', () => {
  let component: Comp;
  let fixture: ComponentFixture<Comp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Comp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
