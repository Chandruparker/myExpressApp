import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-order-management',
  imports: [NgFor, NgIf],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent implements OnInit {
  orders: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.api.getOrders().subscribe(
      (data) => {
        this.orders = data;
        // console.log('Orders:', this.orders);
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }



  viewOrderDetails(order: any): void {
    // console.log('Order details:', order);
  }

 
  updateOrderStatus(event: Event, orderId: string): void {
    const selectedStatus = (event.target as HTMLSelectElement).value; // Get the selected status value
    this.api.updateOrderStatus(orderId, selectedStatus).subscribe({
      next: (response) => {
        alert('Order status updated successfully!');
        this.updateOrderStatusInList(orderId, selectedStatus);
      },
      error: (err) => {
        // console.error('Error updating order status:', err);
      },
    });
  }

  // Update the status locally to reflect changes without reloading
  updateOrderStatusInList(orderId: string, status: string): void {
    const order = this.orders.find((o) => o.orderId === orderId);
    if (order) {
      if (!order.orderStatus) {
        order.orderStatus = [];
      }
      order.orderStatus.push({ status, updatedAt: new Date().toISOString() });
    }
  }
}
