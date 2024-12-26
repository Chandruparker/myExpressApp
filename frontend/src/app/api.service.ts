import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  register(username: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, { username, password, role });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { username, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('userRole', response.role);
        localStorage.setItem('token', response.token);
      })
    );
  }

  forgotPassword(username: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgot-password`, { username, newPassword });
  }

  // CRUD APIs
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/items`);
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


}
