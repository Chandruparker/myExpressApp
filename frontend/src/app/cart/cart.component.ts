import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CartService } from '../cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [NgIf,NgFor, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cart: any[] = []; 
  totalValue: number = 0;
  quantity: number = 1;
  discountedPrice: number = 0;
  totalVaL: number = 0;
  couponCode: string = '';
  validCoupon: string = 'SAVE50'; 
  isCouponApplied: boolean = false;
  paymentOption: string = 'COD'; 
  deliveryOption: string = 'free'; 
  deliveryCharge: number = 0; 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
    
  ) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
    // this.totalValue = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.updateTotal();

  }

  goBack() {
    this.router.navigate(['/home']);
  }

  clearCart(id: number) {
    this.cart = [];
  }

  updateTotal() {
    this.totalValue = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (this.isCouponApplied) {
      this.totalVaL = this.totalValue * 0.5;
      this.discountedPrice = this.totalValue - this.totalVaL;
    }
  }

  applyCoupon() {
    if (this.couponCode === this.validCoupon) {
      this.discountedPrice = this.totalValue * 0.5; 
      this.totalVaL = this.totalValue - this.discountedPrice; 
      this.isCouponApplied = true;
      console.log('Discounted Total:', this.totalVaL);
    } else {
      alert('Invalid Coupon Code');
      this.isCouponApplied = false;
    }
  }
  onDeliveryOptionChange(option: string) {
    this.deliveryOption = option;

    if (this.deliveryOption === 'fast') {
      this.deliveryCharge = 50; 
    } else {
      this.deliveryCharge = 0;
    }
    this.totalVaL = this.totalValue - this.discountedPrice + this.deliveryCharge;
  }

  paymentOptionChange(option: string): void {
    this.paymentOption = option;
   
  }

  checkout() {
   
    this.cartService.setCheckoutData({
      cartItems: this.cart,
      totalValue: this.totalVaL,
      deliveryOption: this.deliveryOption,
      discount: this.discountedPrice,
      paymentType: this.paymentOption,
    });

    this.router.navigate(['/checkout']);
  }

}
