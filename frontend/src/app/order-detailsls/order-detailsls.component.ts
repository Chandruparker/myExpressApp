import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-detailsls',
  imports: [NgIf, FormsModule, NgFor],
  templateUrl: './order-detailsls.component.html',
  styleUrl: './order-detailsls.component.css'
})
export class OrderDetailslsComponent {

  orderId: string = '';
  orderDetails: any = null;
  hasSearched: boolean = false;

  constructor(private api: ApiService) {}

  fetchOrderDetails() {
    this.api.getItemByOrderId(this.orderId).subscribe({
      next: (data) => {
        this.orderDetails = data;
        this.hasSearched = true;
        console.log('Order details:', this.orderDetails);
      },
      error: (err) => {
        console.error('Error fetching order details:', err);
        this.orderDetails = null;
        this.hasSearched = true;
      }
    });
  }

}
