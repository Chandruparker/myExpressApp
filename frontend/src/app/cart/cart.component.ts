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

  cart: any[] = []; // Cart items
  totalValue: number = 0; // Total value of cart
  quantity: number = 1;
  discountedPrice: number = 0;
  totalVaL: number = 0;
  couponCode: string = '';
  validCoupon: string = 'SAVE50'; // Example valid coupon
  isCouponApplied: boolean = false;
  deliveryOption: string = 'free'; // Default delivery option
  deliveryCharge: number = 0; // Delivery charges for "Get by Tomorrow"
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
    
  ) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
    // this.totalValue = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.updateTotal();
    console.log('cart',this.cart)
    console.log('cart',this.totalValue)
  }

  goBack() {
    this.router.navigate(['/product']);
  }
  // checkout() {
  //   this.router.navigate(['/checkout']);
  // }
  clearCart(id: number) {
    this.cart = [];
  }


  // applyCoupon() {
  //   if (this.couponCode === this.validCoupon) {
  //     console.log('Original Total:', this.totalValue);
  //     this.discountedPrice = this.totalValue * 0.5; // Calculate 50% discount
  //     this.totalVaL = this.totalValue - this.discountedPrice; // Apply discount to get the new total
  //     this.isCouponApplied = true;
  //     console.log('Discounted Total:', this.totalVaL);
  //   } else {
  //     alert('Invalid Coupon Code');
  //     this.isCouponApplied = false;
  //   }
  // }
  
  updateTotal() {
    this.totalValue = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Recalculate discounted total if coupon is applied
    if (this.isCouponApplied) {
      this.totalVaL = this.totalValue * 0.5; // 50% discount
      this.discountedPrice = this.totalValue - this.totalVaL;
    }
  }

  // Function to apply coupon code
  applyCoupon() {
    if (this.couponCode === this.validCoupon) {
      this.discountedPrice = this.totalValue * 0.5; // Calculate 50% discount
      this.totalVaL = this.totalValue - this.discountedPrice; // Calculate discounted total
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
      this.deliveryCharge = 50; // Add delivery charge for "Get by Tomorrow"
    } else {
      this.deliveryCharge = 0; // Free delivery has no extra charge
    }

    // Recalculate final total based on delivery charge
    this.totalVaL = this.totalValue - this.discountedPrice + this.deliveryCharge;
  }

  checkout() {
    // Pass data to the checkout page via CartService
    this.cartService.setCheckoutData({
      cartItems: this.cart,
      totalValue: this.totalVaL,
      deliveryOption: this.deliveryOption,
      discount: this.discountedPrice
    });

    // Navigate to the checkout page
    this.router.navigate(['/checkout']);
  }

}
