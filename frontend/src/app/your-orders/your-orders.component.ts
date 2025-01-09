import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-your-orders',
  imports: [NgIf,NgFor],
  templateUrl: './your-orders.component.html',
  styleUrl: './your-orders.component.css'
})
export class YourOrdersComponent implements OnInit{

   orderId: string = '';
    orderDetails: any = null;
    hasSearched: boolean = false;
  
    constructor(private api: ApiService) {}

    ngOnInit(): void {
      this.fetchOrderDetails();
    }

    fetchOrderDetails(): void {
      const loggedInUserName = localStorage.getItem('userName'); // Get the username from localStorage
    
      if (!loggedInUserName) {
        console.error('No username found in localStorage');
        this.orderDetails = null;
        this.hasSearched = true;
        return;
      }
    
      this.api.getOrders().subscribe({
        next: (data) => {
          // Filter orders by username
          const userOrders = data.filter((order: any) => order.userName === loggedInUserName);
    
          // Flatten the orders to map `orderId` with individual cart items
          this.orderDetails = userOrders.flatMap((order: any) => {
            return order.orderDetails.cartItems.map((cartItem: any) => ({
              orderId: order.orderId,
              createdAt: order.createdAt,
              ...cartItem, // Include cart item details
            }));
          });
    
          console.log('Flattened Order Details:', this.orderDetails);
          this.hasSearched = true;
        },
        error: (err) => {
          console.error('Error fetching order details:', err);
          this.orderDetails = null;
          this.hasSearched = true;
        }
      });
    }
    
    
}
