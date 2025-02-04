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
users: any[] = [];

constructor(private api: ApiService,private route: ActivatedRoute,private router: Router) {}

setActiveTab(tab: string) {
  this.activeTab = tab;
  this.message = ''; // Clear any previous messages
}

onLogin() {
  this.api.getUsers().subscribe(
    (users) => {
      this.api.login(this.loginData.username, this.loginData.password).subscribe(
        (response) => {
          const loggedInUser = users.find(user => user.username === response.user.username);

          if (loggedInUser) {
            const latestStatus = loggedInUser.userStatus[loggedInUser.userStatus.length - 1];

            // Check if the user is blocked
            if (latestStatus?.status === 'blocked') {
              alert('Your account is blocked. Please contact your administrator.');
              return; // Do not proceed with login or redirect
            }

            // Proceed with login for non-blocked users
            localStorage.setItem('userRole', response.user.role);
            localStorage.setItem('token', response.user.token);
            localStorage.setItem('userName', response.user.username);
            sessionStorage.setItem('username', response.user.username);

            this.message = 'Login successful!';
            if (response.user.role === 'admin') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/home']);
            }
          }
        },
        (error) => {
          this.message = 'Invalid credentials.';
        }
      );
    },
    (error) => {
      console.error('Failed to fetch users:', error);
    }
  );
}




onLogin2(): void {
  this.api.login(this.loginData.username, this.loginData.password).subscribe(
    (response) => {
      console.log('Login successful:', response);
      this.message = 'Login successful!';
      this.router.navigate(['/product']); // Navigate to the desired route
    },
    (error) => {
      console.error('Login failed:', error);
      this.message = 'Invalid credentials. Please try again.';
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
