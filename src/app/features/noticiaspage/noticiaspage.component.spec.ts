import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaspageComponent } from './noticiaspage.component';

describe('NoticiaspageComponent', () => {
  let component: NoticiaspageComponent;
  let fixture: ComponentFixture<NoticiaspageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiaspageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiaspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
