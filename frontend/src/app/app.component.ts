import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { CrudComponent } from "./crud/crud.component";
import { CommonModule, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CartService } from './cart.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet,MatToolbarModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
 constructor(
  
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
   
  ) {}
  ngOnInit() {
    // Subscribe to the cart count
    this.cartService.cartCount$.subscribe((count) => {
      this.cartItemCount = count;
      console.log('count',count)
    });
  }

  title = 'frontend';
  cart: any[] = [];
  cartItemCount: number = 0;

  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }
  
  isUser(): boolean {
    return localStorage.getItem('userRole') === 'user';
  }
  navigateToCart() {
    // Navigate to the cart page and pass the cart data
    this.router.navigate(['/cart'], { state: { cart: this.cart } });
  }
  navigateToHome(){
    this.router.navigate(['/product']);
  }
  navigateToLogin(){
    this.router.navigate(['/login']);
  }
 
}
