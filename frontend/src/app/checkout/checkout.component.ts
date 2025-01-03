import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CartService } from '../cart.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [NgFor,NgIf],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  cart: any[] = []; // Cart items
  totalValue: number = 0; // Total value of cart
  checkoutData: any = {};
 constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
    
  ) {}

  ngOnInit() {
    this.checkoutData = this.cartService.getCheckoutData();

    // Calculate Tax (8%) and GST (12%)
    this.checkoutData.tax = this.checkoutData.totalValue * 0.08;
    this.checkoutData.gst = this.checkoutData.totalValue * 0.12;
  }

  payment(){
    this.router.navigate(['/billing'])
  }
}
