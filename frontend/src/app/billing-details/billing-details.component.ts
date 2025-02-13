import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ApiService } from '../api.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-billing-details',
  imports: [FormsModule],
  templateUrl: './billing-details.component.html',
  styleUrl: './billing-details.component.css'
})
export class BillingDetailsComponent implements OnInit {
  billingData: any = {
    name: '',
    address: '',
    city: '',
    postalCode: '',
    contact: ''
  };
  orderDetails: any = {}; 
  userName: string | null = '';

  constructor(private http: HttpClient,  private route: ActivatedRoute,
      private router: Router, private api: ApiService, private cartService: CartService) {}

      ngOnInit() {
        this.userName = localStorage.getItem('userName');
        if (this.userName) {
          this.billingData.name = this.userName; 
        }
    
        this.orderDetails = this.cartService.getCheckoutData()
      }
    
      submitBillingDetails() {
        const payload = {
          userName: this.billingData.name,
          address: {
            address: this.billingData.address,
            city: this.billingData.city,
            postalCode: this.billingData.postalCode,
            contact: this.billingData.contact
          },
          orderDetails: this.orderDetails,
          orderId: this.api.generateOrderId() 
        };
    
      
    
        this.api.submitBillingDetails(payload).subscribe(
          (response) => {
            console.log('Order submitted successfully:', response);
            alert('Order submitted successfully!');
            this.router.navigate(['/home']);
            this.cartService.clearCart(); 

          },
          (error) => {
            console.error('Error submitting order:', error);
            alert('Failed to submit the order. Please try again.');
          }
        );
      }
}
