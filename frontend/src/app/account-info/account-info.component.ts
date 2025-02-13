import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-account-info',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.css'
})
export class AccountInfoComponent implements OnInit {
  profileForm!: FormGroup;
  isEditMode: boolean = false; 
  username!: string; 
  profile: any = {}; 

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.initForm();

   
    this.username = localStorage.getItem('userName') || '';
    if (this.username) {
      this.fetchUserProfile(this.username);
    } else {
      console.error('Username not found in local storage!');
    }
  }

 
  private initForm(): void {
    this.profileForm = this.fb.group({
      fullName: [''],
      username: [''],
      email: [''],
      phone: [''],
      dob: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        postalCode: [''],
        country: [''],
      }),
    });
  }

 
  private fetchUserProfile(username: string): void {
    this.api.getUserProfileByUsername(username).subscribe({
      next: (profile) => {
        this.profile = profile; 
        this.profileForm.patchValue(profile); 
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      },
    });
  }

  
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    
    if (!this.isEditMode) {
      this.profileForm.patchValue(this.profile);
    }
  }

 
  saveChanges(): void {
    if (this.profileForm.valid) {
      const updatedProfile = this.profileForm.value;

      this.api.updateUserProfile(updatedProfile).subscribe({
        next: (updatedData) => {
          this.profile = updatedData; 
          this.isEditMode = false; 
          alert('Profile updated successfully!');
        },
        error: (err) => {
          console.error('Error updating profile:', err);
        },
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
