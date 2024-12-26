import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute,Router } from '@angular/router';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-view-product',
  imports: [],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css'
})
export class ViewProductComponent {
  item: any = {};

  
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // ngOnInit() {
   
  //   const productId = Number(this.route.snapshot.paramMap.get('productId'));
  //   if (!isNaN(productId)) {
  //     this.api.getItemById(productId).subscribe((data) => {
  //       this.item = data;
  //       console.log('val',data)
  //     });
     
  //   } else {
  //     console.error('Invalid ID');
  //     this.router.navigate(['/items']); 
  //   }
  // }
  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('productId'));
  
    if (!isNaN(productId)) {
      this.api.getItemById(productId).subscribe((data) => {
        // Ensure the image URL is complete
        if (data.image) {
          data.image = `http://localhost:3000${data.image}`;
        }
  
        this.item = data;
        console.log('Fetched product:', this.item);
      });
    } else {
      console.error('Invalid ID');
      this.router.navigate(['/items']);
    }
  }
  
  goBack() {
    this.router.navigate(['/product']);
  }
}
