import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];
  private checkoutData: any = {};
  private cartCount = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCount.asObservable(); 

  addToCart(item: any) {
    const existingItem = this.cart.find(cartItem => cartItem.productId === item.productId); 
     
    if (existingItem) {
    
      existingItem.quantity += item.quantity; 
      existingItem.totalPrice += item.totalPrice; 
    } else {
      this.cart.push(item); 
      console.log('cartServiceValue',this.cart)
    }

    this.updateCartCount(); 
  }

  getCart() {
    return this.cart;
  }

  private updateCartCount() {
    const distinctItemCount = this.cart.length; 
    this.cartCount.next(distinctItemCount); 
  }
  setCheckoutData(data: any) {
    this.checkoutData = data;
  }

  getCheckoutData() {
    return this.checkoutData;
  }
  clearCart() {
    this.cart = [];
    this.updateCartCount(); 
  }
}
