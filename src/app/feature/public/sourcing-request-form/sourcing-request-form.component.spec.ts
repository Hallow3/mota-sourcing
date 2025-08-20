import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcingRequestFormComponent } from './sourcing-request-form.component';

describe('SourcingRequestFormComponent', () => {
  let component: SourcingRequestFormComponent;
  let fixture: ComponentFixture<SourcingRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourcingRequestFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourcingRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
