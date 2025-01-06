import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-user-management',
  imports: [NgFor],
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
        console.error('Error fetching orders:', error);
      }
    );
  }



  viewOrderDetails(order: any): void {
    console.log('Order details:', order);
  }
}

