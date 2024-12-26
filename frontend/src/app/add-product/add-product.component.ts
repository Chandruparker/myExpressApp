import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-add-product',
  imports: [FormsModule,MatCardModule,MatButtonModule,MatInputModule,ReactiveFormsModule,MatFormFieldModule,NgFor],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  itemForm: FormGroup;
  preview: string | ArrayBuffer | null = null;
  items: any[] = [];
  itemName = '';
  itemDescription = '';
  itemCategory = '';
  itemPrice: number | null = null;
  selectedImage: File | null = null;
  categories = ['Electronics', 'Clothing', 'Books', 'Furniture'];
  isEditing = false;
  editingItemId: number | null = null;
  
  constructor(private api: ApiService,private route: ActivatedRoute,private router: Router, private fb: FormBuilder) {
    this.itemForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(500)]],
      image: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems() {
    this.api.getItems().subscribe((data) => {
      this.items = data;
    });
  }

  // addItem() {
  //   const newItem = { name: this.itemName, description: this.itemDescription, image:this.selectedImage };
  //   this.api.addItem(newItem).subscribe(() => {
  //     this.fetchItems();
  //     this.itemName = '';
  //     this.itemDescription = '';
  //     console.log('data', this.itemName,this.itemDescription)
  //   });
  //   this.router.navigate(['/product']);
  // }

  // onFileChange(event: Event): void {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     this.selectedImage = fileInput.files[0];

  //     // Preview the image
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.preview = reader.result;
  //     };
  //     reader.readAsDataURL(this.selectedImage);

  //     this.itemForm.patchValue({ image: this.selectedImage });
  //   }
  // }

  addItem(): void {
    const formData = new FormData();
    formData.append('name', this.itemName);
    formData.append('description', this.itemDescription);
    formData.append('category', this.itemCategory);
    formData.append('price', this.itemPrice?.toString() || '');
     if (!this.itemName || !this.itemDescription || !this.itemCategory || !this.itemPrice || !this.selectedImage) {
      alert('All fields are required.');
      return;
    }
    console.log('FormData contents:'); // Debugging
    formData.forEach((value, key) => console.log(key, value));
    
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.api.addItem(formData).subscribe((res) => {
      this.router.navigate(['/product']);
      console.log('formval',res)
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      console.log('Selected File:', this.selectedImage); 
    }
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      console.log('Form Data:', this.itemForm.value);
    }
  }
}
