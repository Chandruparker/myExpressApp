import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute,Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../cart.service';


@Component({
  selector: 'app-view-product',
  imports: [FormsModule, NgIf],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css'
})
export class ViewProductComponent {
  item: any = {image: []};
  quantity: number = 1; 
  cart: any[] = []; 
  totalValue: number = 0;
  cartItem: any[] = [];
  cartItemCount: number = 0;
  
  productDetails = {
    name: 'Faded SkyBlu Denim Jeans',
    price: 149.99,
    category: 'Household',
    availability: 'In Stock',
    description:
      'Mill Oil is an innovative oil-filled radiator with the most modern technology.',
  };
  productImages: string[] = [];
  currentImageIndex = 0; 
  selectedImage: string = '';
  specification: boolean=false
  selectedTab: string = 'specification';
  
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const productId = Number(params['productId']);
  
      if (!isNaN(productId)) {
        this.api.getItemById(productId).subscribe((data) => {
          if (data.image && Array.isArray(data.image)) {
           
            this.item = {
              ...data,
              image: data.image.map((imgPath: string) => `http://localhost:3000${imgPath}`)
            };
          } else {
            this.item = data;
            // console.warn('No images found for this product.');
          }
  
          // console.log('Fetched product:', this.item);
        });
      } else {
        console.error('Invalid ID');
        this.router.navigate(['/items']); 
      }
    });
  }
  
  
  goBack() {
    this.router.navigate(['/product']);
  }

  addToCart() {
    const cartItem = {
      ...this.item,
      quantity: this.quantity,
      totalPrice: this.item.price * this.quantity,
      
    };
    this.cartService.addToCart(cartItem);
  
  }

  navigateToCart() {
   
    this.router.navigate(['/cart'], { state: { cart: this.cart } });
  }
  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.item.image.length - 1) {
      this.currentImageIndex++;
    }
  }
  setSelected(tab: string) {
    this.selectedTab = tab;
  }
}
