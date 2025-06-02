import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrimonioComponent } from './matrimonio.component';

describe('MatrimonioComponent', () => {
  let component: MatrimonioComponent;
  let fixture: ComponentFixture<MatrimonioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrimonioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrimonioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
