import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UncionComponent } from './uncion.component';

describe('UncionComponent', () => {
  let component: UncionComponent;
  let fixture: ComponentFixture<UncionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UncionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
