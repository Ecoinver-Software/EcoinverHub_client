import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApphubComponent } from './apphub.component';

describe('ApphubComponent', () => {
  let component: ApphubComponent;
  let fixture: ComponentFixture<ApphubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApphubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApphubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
