import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuestraparroquiaComponent } from './nuestraparroquia.component';

describe('NuestraparroquiaComponent', () => {
  let component: NuestraparroquiaComponent;
  let fixture: ComponentFixture<NuestraparroquiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuestraparroquiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuestraparroquiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
