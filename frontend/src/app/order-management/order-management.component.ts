import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-order-management',
  imports: [NgFor],
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
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }



  viewOrderDetails(order: any): void {
    console.log('Order details:', order);
  }
}
