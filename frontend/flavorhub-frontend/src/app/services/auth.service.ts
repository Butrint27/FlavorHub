import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  sub: number;
  email: string;
  fullName: string;
  iat?: number;
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  register(data: { fullName: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        const token =
          res?.tokens?.access_token ||
          res?.access_token ||
          res?.token ||
          res?.jwt ||
          null;

        if (!token) throw new Error('Invalid credentials');

        // Save token
        localStorage.setItem('access_token', token);

        // Decode JWT (correct version)
        const decoded: DecodedToken = jwtDecode(token);
        localStorage.setItem('current_user', JSON.stringify(decoded));
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUser(): DecodedToken | null {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
  }
}












