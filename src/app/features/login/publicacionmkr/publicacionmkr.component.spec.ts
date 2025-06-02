import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionmkrComponent } from './publicacionmkr.component';

describe('PublicacionmkrComponent', () => {
  let component: PublicacionmkrComponent;
  let fixture: ComponentFixture<PublicacionmkrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionmkrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionmkrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
