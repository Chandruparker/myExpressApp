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
      const productId = Number(this.route.snapshot.paramMap.get('productId'));
      if (!isNaN(productId)) {
        this.api.getItemById(productId).subscribe((data) => {
          this.item = data; // Assign the data to 'item'
        });
      } else {
        console.error('Invalid ID');
        this.router.navigate(['/items']); // Redirect to list page
      }
    }
  
    updateItem(): void {
      const productId = this.item.productId;
      if (isNaN(productId)) {
        console.error('Invalid productId:', productId);
        return; // Don't proceed with the update if the productId is invalid
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
