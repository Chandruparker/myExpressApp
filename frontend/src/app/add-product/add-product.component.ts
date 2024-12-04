import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {

  items: any[] = [];
  itemName = '';
  itemDescription = '';
  isEditing = false;
  editingItemId: number | null = null;
  
  constructor(private api: ApiService,private route: ActivatedRoute,private router: Router) {}

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems() {
    this.api.getItems().subscribe((data) => {
      this.items = data;
    });
  }

  addItem() {
    const newItem = { name: this.itemName, description: this.itemDescription };
    this.api.addItem(newItem).subscribe(() => {
      this.fetchItems();
      this.itemName = '';
      this.itemDescription = '';
      console.log('data', this.itemName,this.itemDescription)
    });
    this.router.navigate(['/product']);
  }
}
