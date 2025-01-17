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
      if (typeof window !== 'undefined' && window.localStorage) {
        const loggedInUserName = localStorage.getItem('userName');
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
      
            // Flatten the orders to include additional fields
            this.orderDetails = userOrders.flatMap((order: any) => {
              return order.orderDetails.cartItems.map((cartItem: any) => ({
                orderId: order.orderId,
                createdAt: order.createdAt,
                address: order.address, // Include address
                orderStatus: order.orderStatus, // Include order status
                ...cartItem, // Include cart item details
              }));
            });
      
            console.log('Flattened Order Details with Additional Fields:', this.orderDetails);
            this.hasSearched = true;
          },
          error: (err) => {
            console.error('Error fetching order details:', err);
            this.orderDetails = null;
            this.hasSearched = true;
          },
        });}
          
      // Get the username from localStorage
    
   
    
   
    }
    
    
    
}
