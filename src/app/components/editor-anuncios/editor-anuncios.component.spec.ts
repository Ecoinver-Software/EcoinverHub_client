import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorAnunciosComponent } from './editor-anuncios.component';

describe('EditorAnunciosComponent', () => {
  let component: EditorAnunciosComponent;
  let fixture: ComponentFixture<EditorAnunciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorAnunciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorAnunciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
