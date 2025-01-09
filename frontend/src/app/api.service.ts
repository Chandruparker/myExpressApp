import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';
  private userRoleSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  register(username: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, { username, password, role });
  }

  getUserRole(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    const payload = { username, password };
    return this.http.post(`${this.baseUrl}/auth/login`, payload).pipe(
      tap((response: any) => {
        if (response?.user?.role) {
          // Store role and token in local storage
          localStorage.setItem('userRole', response.user.role);
          localStorage.setItem('token', response.user.token || '');
          localStorage.setItem('userName', response.user.username);
          // Emit role via BehaviorSubject
          this.userRoleSubject.next(response.user.role);
        } else {
          console.error('Invalid login response format:', response);
        }
      })
    );
  }
  
  initializeRole(): void {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.userRoleSubject.next(storedRole); // Initialize the role if stored in localStorage
    }
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    this.userRoleSubject.next(null); // Emit null on logout
  }
  
  

  forgotPassword(username: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgot-password`, { username, newPassword });
  }

  // CRUD APIs
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/items`);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/orders`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/users`);
  }

  // getItemById(productId: number): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/api/items/${productId}`);
  // }
  getItemById(productId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/items/${productId}`);
  }
  

  // addItem(item: { name: string; description: string, image: any }): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/api/items`, item);
  // }
  addItem(item: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/items`, item);
  }
  updateItem(productId: number, item: { name: string; description: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/items/${productId}`, item);
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/items/${id}`);
  }
  generateOrderId(): string {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

 
  submitBillingDetails(billingData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/submitOrder`, billingData);
  }

  getItemByOrderId(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/orders/${orderId}`);
  }
  updateUserProfile(profile: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/profile`, profile);
  }
  getUserProfileByUsername(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/profile?username=${username}`);
  }


  
}
