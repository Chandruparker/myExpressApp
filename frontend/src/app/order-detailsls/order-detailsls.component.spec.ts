import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailslsComponent } from './order-detailsls.component';

describe('OrderDetailslsComponent', () => {
  let component: OrderDetailslsComponent;
  let fixture: ComponentFixture<OrderDetailslsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailslsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailslsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
