import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  imports: [NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // Mock product data

  orderDetails: any = null;
  baseUrl: string = 'http://localhost:3000';
  products: any[] = [];
  constructor(private router: Router,private api:ApiService) {}

  ngOnInit(): void {
    this.api.getItems().subscribe({
      next: (data) => {
        // Map the image paths to include the base URL
        this.orderDetails = data.map((item) => {
          // Append base URL to each image in the image array
          const updatedImages = item.image.map((img: string) => `http://localhost:3000${img}`);
  
          return {
            ...item,
            image: updatedImages // Update the image field to hold the full URL
          };
        });
  
        console.log('Order details with updated images:', this.orderDetails);
      },
      error: (err) => {
        console.error('Error fetching order details:', err);
        this.orderDetails = null;
      }
    });
  }
  

  // Helper method to generate stars for rating
  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  // Add to Cart Functionality
  addToCart(product: any): void {
    console.log(`${product.name} added to cart!`);
    alert(`${product.name} has been added to your cart.`);
  }
  viewProduct(productId:number){
    this.router.navigate(['/items/view', productId]);
  }
}

