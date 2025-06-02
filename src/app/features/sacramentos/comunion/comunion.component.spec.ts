import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunionComponent } from './comunion.component';

describe('ComunionComponent', () => {
  let component: ComunionComponent;
  let fixture: ComponentFixture<ComunionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComunionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
