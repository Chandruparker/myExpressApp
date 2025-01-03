import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];
  private checkoutData: any = {};
  private cartCount = new BehaviorSubject<number>(0); // BehaviorSubject for item count

  cartCount$ = this.cartCount.asObservable(); // Observable for cart count

  addToCart(item: any) {
    const existingItem = this.cart.find(cartItem => cartItem.productId === item.productId); 
     
    if (existingItem) {
    
      existingItem.quantity += item.quantity; // Update quantity if the item exists
      existingItem.totalPrice += item.totalPrice; // Update total price
    } else {
      this.cart.push(item); // Add a new item to the cart
      console.log('cartServiceValue',this.cart)
    }

    this.updateCartCount(); // Update distinct item count
  }

  getCart() {
    return this.cart;
  }

  private updateCartCount() {
    const distinctItemCount = this.cart.length; // Count unique items
    this.cartCount.next(distinctItemCount); // Update BehaviorSubject with unique item count
  }
  setCheckoutData(data: any) {
    this.checkoutData = data;
  }

  getCheckoutData() {
    return this.checkoutData;
  }
  clearCart() {
    this.cart = [];
    this.updateCartCount(); // Update distinct item count
  }
}
