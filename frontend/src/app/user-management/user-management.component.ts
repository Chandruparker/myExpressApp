import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-user-management',
  imports: [NgFor,NgIf],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.api.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        // console.error('Error fetching orders:', error);
      }
    );
  }



  viewOrderDetails(order: any): void {
    // console.log('Order details:', order);
  }

  updateUserStatus(event: Event, username: string): void {
    const selectedStatus = (event.target as HTMLSelectElement).value; 
    this.api.updateUserStatus(username, selectedStatus).subscribe({
      next: (response) => {
        alert('User status updated successfully!');
        this.updateUserStatusInList(username, selectedStatus);
      },
      error: (err) => {
        // console.error('Error updating user status:', err);
      },
    });
  }

  updateUserStatusInList(username: string, status: string): void {
    const user = this.users.find((o) => o.username === username);
    if (user) {
      if (!user.userStatus) {
        user.userStatus = [];
      }
      user.userStatus.push({ status, updatedAt: new Date().toISOString() });
    }
  }
}

