import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaseditComponent } from './noticiasedit.component';

describe('NoticiaseditComponent', () => {
  let component: NoticiaseditComponent;
  let fixture: ComponentFixture<NoticiaseditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiaseditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiaseditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
