import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ChartData, ChartOptions } from 'chart.js';



@Component({
  selector: 'app-admin-dashboard',
  imports: [MatToolbarModule, MatSidenavModule, MatListModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  // Sample data for bar chart
  public barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56],
        label: 'Sales',
      },
    ],
  };

  // Chart options
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
}
