import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ChartData, ChartOptions } from 'chart.js';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ApiService } from '../api.service';
import { Color } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-admin-dashboard',
  imports: [MatToolbarModule, MatSidenavModule, MatListModule,NgxChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  totalUsers: number = 0;
  userRoleData: any[] = [];
  userRoleView: [number, number] = [400, 300];
  userRoleGradient: boolean = true;
  userRoleColorScheme = {
    domain: ['#FF6384', '#36A2EB', '#FFCE56']
  };

  // Bar Chart Data for Order Value Over Time
  orderData: any[] = [];
  orderView: [number, number] = [700, 400]; 
  orderGradient: boolean = true;
  orderShowXAxis: boolean = true;
  orderShowYAxis: boolean = true;
  orderShowLegend: boolean = true;
  orderShowXAxisLabel: boolean = true;
  orderXAxisLabel: string = 'Date';
  orderShowYAxisLabel: boolean = true;
  orderYAxisLabel: string = 'Order Value';
  orderColorScheme = {
    domain: ['#5AA454']
  };
  orders: any[] = [];
  
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getUsers().subscribe((users: any[]) => {
      const roleCounts = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      this.totalUsers = users.length;
      this.userRoleData = Object.keys(roleCounts).map(role => ({
        name: role,
        value: roleCounts[role]
      }));
    });

    this.api.getOrders().subscribe((orders: any[]) => {
      const groupedData = orders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + order.orderDetails.totalValue;
        return acc;
      }, {});

      this.orderData = Object.keys(groupedData).map(date => ({
        name: date,
        value: groupedData[date]
      }));
    });
    this.api.getOrders().subscribe(
      (data) => {
        this.orders = data;
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }
}