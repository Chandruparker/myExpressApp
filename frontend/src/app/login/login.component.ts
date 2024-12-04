import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {



activeTab: string = 'login'; // Tracks the active tab
loginData = { username: '', password: '' };
registerData = { username: '', password: '', role: 'user' };
forgotData = { username: '', newPassword: '' };
message = '';
localStorage = ""

constructor(private api: ApiService,private route: ActivatedRoute,private router: Router) {}

setActiveTab(tab: string) {
  this.activeTab = tab;
  this.message = ''; // Clear any previous messages
}

onLogin() {
  this.api.login(this.loginData.username, this.loginData.password).subscribe(
    (response) => {
      console.log('resval',response.user.role)
      if (response && response.user.role) {
        localStorage.setItem('userRole', response.user.role); // Store the role
        localStorage.setItem('token', response.token); // Store the token
      } else {
        console.error('Login response does not contain role');
      }
      this.message = 'Login successful!';
      this.router.navigate(['/product']);
    },
    (error) => {
      this.message = 'Invalid credentials.';
    }
  );
}


onRegister() {
  this.api
    .register(
      this.registerData.username,
      this.registerData.password,
      this.registerData.role
    )
    .subscribe(
      (response) => {
        this.message = 'Registration successful! Please login.';
        this.setActiveTab('login'); // Navigate to login after successful registration
      },
      (error) => {
        this.message = 'Registration failed. Username might already exist.';
      }
    );
}

onForgotPassword() {
  this.api
    .forgotPassword(this.forgotData.username, this.forgotData.newPassword)
    .subscribe(
      (response) => {
        this.message = 'Password reset successful! Please login.';
        this.setActiveTab('login'); // Navigate to login after password reset
      },
      (error) => {
        this.message = 'Error resetting password. User not found.';
      }
    );
}


}
