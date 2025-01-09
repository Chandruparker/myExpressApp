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
  isEditMode: boolean = false; // For toggling between cards
  username!: string; // To store the username fetched from localStorage
  profile: any = {}; // To store the profile details for the view card

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.initForm();

    // Retrieve username from localStorage
    this.username = localStorage.getItem('userName') || '';
    if (this.username) {
      this.fetchUserProfile(this.username);
    } else {
      console.error('Username not found in local storage!');
    }
  }

  // Initialize the profile form
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

  // Fetch user profile data
  private fetchUserProfile(username: string): void {
    this.api.getUserProfileByUsername(username).subscribe({
      next: (profile) => {
        this.profile = profile; // Store the profile data for the view card
        this.profileForm.patchValue(profile); // Populate the form with profile data
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      },
    });
  }

  // Toggle edit mode (between view card and edit card)
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    // If cancel is clicked, reset the form to the original profile data
    if (!this.isEditMode) {
      this.profileForm.patchValue(this.profile);
    }
  }

  // Save profile changes
  saveChanges(): void {
    if (this.profileForm.valid) {
      const updatedProfile = this.profileForm.value;

      this.api.updateUserProfile(updatedProfile).subscribe({
        next: (updatedData) => {
          this.profile = updatedData; // Update the view card with the updated profile
          this.isEditMode = false; // Exit edit mode
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
