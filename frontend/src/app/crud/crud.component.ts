import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-crud',
  imports: [FormsModule,NgFor, MatPaginator, NgIf,RouterModule, MatIconModule, MatButtonModule,MatFormFieldModule, MatInputModule, MatTableModule],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css'
})
export class CrudComponent {
  items: any[] = [];
  itemName = '';
  itemDescription = '';
  isEditing = false;
  editingItemId: number | null = null;
  userRole: string = '';
  filteredProducts: any[] = [];
  categories: string[] = [];
  
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['productId','name','description','price', 'category', 'createdAt', 'actions'];
 
  constructor(private api: ApiService,private route: ActivatedRoute,private router: Router,) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      this.userRole = localStorage.getItem('userRole') || '';
    } else {
      // console.warn('localStorage is not available.');
      this.userRole = '';
    }
    this.api.getItems().subscribe((data) => {
      this.items = data.map((item) => ({
        ...item,
        category: item.category ? item.category.trim().toLowerCase() : '',
      }));
      this.dataSource.data = this.items;
      const uniqueCategories = new Set(this.items.map((item) => item.category));
      this.categories = ['all', ...Array.from(uniqueCategories)];
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchItems() {
    this.api.getItems().subscribe((data) => {
      this.items = data;
    })

  }

  addItem() {
    this.router.navigate(['/add',]);
  }
  viewItem(productId: number) {
    this.router.navigate(['items', 'view'], { queryParams: { productId } });
  }
  editItem(productId: any) {
    this.router.navigate(['items', 'edit'], { queryParams: { productId } });
  }
  updateItem() {
    if (this.editingItemId !== null) {
      const updatedItem = { name: this.itemName, description: this.itemDescription };
      this.api.updateItem(this.editingItemId, updatedItem).subscribe(() => {
        this.fetchItems();
        this.isEditing = false;
        this.editingItemId = null;
        this.itemName = '';
        this.itemDescription = '';
      });
    }
  }
  deleteItem(id: number) {
    this.api.deleteItem(id).subscribe(() => {
      this.fetchItems();
    });
  


  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  
  onCategoryChange(event: Event): void {
    const selectedCategory = (event.target as HTMLSelectElement).value.trim().toLowerCase();
  
    if (selectedCategory === 'all') {
      this.dataSource.data = [...this.items];
    } else {
      this.dataSource.data = this.items.filter(
        (item) => item.category === selectedCategory
      ); 
    }
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  
}
