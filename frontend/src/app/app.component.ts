import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { CrudComponent } from "./crud/crud.component";
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }
  
  isUser(): boolean {
    return localStorage.getItem('userRole') === 'user';
  }
  
}
