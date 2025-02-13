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
  imageUploadForm: FormGroup;
  selectedFiles: File[] = [];
  selectedImages: File[] = [];
  imagePreviews: string[] = [];
  
  constructor(private api: ApiService,private route: ActivatedRoute,private router: Router, private fb: FormBuilder) {
    this.itemForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(500)]],
      image: [null, Validators.required]
    });
    this.imageUploadForm = this.fb.group({
      images: [null],
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

  addItem(): void {
    const formData = new FormData();

    formData.append('name', this.itemName);
    formData.append('description', this.itemDescription);
    formData.append('category', this.itemCategory);
    formData.append('price', this.itemPrice?.toString() || '');
  
    if (!this.itemName || !this.itemDescription || !this.itemCategory || !this.itemPrice || this.selectedImages.length === 0) {
      alert('All fields and at least one image are required.');
      return;
    }

    this.selectedImages.forEach((file) => {
      formData.append('images', file); 
    });
  
    console.log('FormData contents:');
    formData.forEach((value, key) => console.log(key, value));

    this.api.addItem(formData).subscribe(
      (res) => {
        this.router.navigate(['/product']);
        console.log('Response:', res);
      },
      (err) => {
        console.error('Error:', err);
      }
    );
  }
  

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      this.selectedImages = Array.from(input.files); 
      this.imagePreviews = []; 
  
      this.selectedImages.forEach((file) => {
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result); 
        };
  
        reader.readAsDataURL(file); 
      });
  
      console.log('Selected Files:', this.selectedImages);
      console.log('Image Previews:', this.imagePreviews);
    }
  }
  


onSubmit(): void {
  if (this.itemForm.valid) {
    console.log('Form Data:', this.itemForm.value);
  }
}  
}
