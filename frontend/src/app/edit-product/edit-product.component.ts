import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';

import { ActivatedRoute,Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  imports: [FormsModule,NgIf],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {

  items: any[] = [];
  itemName = '';
  itemDescription = '';
  isEditing = true;
  editingItemId: number | null = null;
  
  constructor(private api: ApiService, private route: ActivatedRoute,
    private router: Router) {}

    item: any = {}; 
  
ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const productId = Number(params['productId']); 
      if (!isNaN(productId)) {
        this.api.getItemById(productId).subscribe({
          next: (data) => {
            this.item = data;
            console.log('Item:', data);
          },
          error: (err) => {
            console.error('Error fetching item:', err);
            this.router.navigate(['/items']); 
          }
        });
      } else {
        console.error('Invalid ID');
        this.router.navigate(['/items']); 
      }
    });
  }
  
    updateItem(): void {
      debugger
      const productId = this.item.productId;
      console.log('Updating item:', this.item.productId);
      if (isNaN(productId)) {
        console.error('Invalid productId:', productId);
        return; 
      }
    
      this.api.updateItem(productId, this.item).subscribe(() => {
        alert('Item updated successfully');
        this.router.navigate(['/product']);
      });
    }
    

    cancel(){
      this.router.navigate(['/product']);
    }
  
}
