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
        
          localStorage.setItem('userRole', response.user.role);
          localStorage.setItem('token', response.user.token || '');
          localStorage.setItem('userName', response.user.username);
         
          this.userRoleSubject.next(response.user.role);
        } else {
          console.error('Invalid login response format:', response);
        }
      })
    );
  }

  

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.userRoleSubject.next(null); 
  }
  
  

  forgotPassword(username: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgot-password`, { username, newPassword });
  }


  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/items`);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/orders`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/users`);
  }

  getItemById(productId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/items/${productId}`);
  }
 
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
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/orders/${orderId}/status`, { status });
  }
  updateUserStatus(username: string, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/users/${username}/status`, { status });
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

  getUserName(): string | null {
    if (typeof window !== 'undefined' && sessionStorage) {
      return sessionStorage.getItem('username');
    }
    return null; 
  }
  
  
}
