// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, switchMap, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { lastValueFrom } from 'rxjs';

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
  private currentUser: DecodedToken | null = null;

  constructor(private http: HttpClient) {}

  // Register / Login same as before
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

        localStorage.setItem('access_token', token);
        this.currentUser = jwtDecode<DecodedToken>(token);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.currentUser = null;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUser(): DecodedToken | null {
    if (this.currentUser) return this.currentUser;
    const token = this.getToken();
    if (!token) return null;
    try {
      this.currentUser = jwtDecode<DecodedToken>(token);
      return this.currentUser;
    } catch {
      return null;
    }
  }

  // Local quick check (expiration only)
  validateToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  // ----- Remote validation: call backend to verify the token -----
  async validateTokenRemote(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await lastValueFrom(this.http.get(`${this.apiUrl}/me`, { headers }));
      this.currentUser = jwtDecode<DecodedToken>(token); 
      return true;
    } catch (err: any) {
      this.logout();
      return false;
    }
  }

  // Backend calls using Authorization header (examples)
  fetchUser(): Observable<{ fullName: string; email: string; avatar?: string }> {
    const user = this.getUser();
    if (!user) throw new Error('No user logged in');
    return this.http.get<{ fullName: string; email: string; avatar?: string }>(
      `${this.apiUrl}/${user.sub}`,
      { headers: { Authorization: `Bearer ${this.getToken()}` } }
    );
  }

  getUserById(userId: number): Observable<{ fullName: string; email: string; avatar?: string }> {
    return this.http.get<{ fullName: string; email: string; avatar?: string }>(
      `${this.apiUrl}/${userId}`,
      { headers: { Authorization: `Bearer ${this.getToken()}` } }
    );
  }

  updateUser(data: { fullName?: string; email?: string; password?: string; avatar?: File }): Observable<any> {
    const user = this.getUser();
    if (!user) throw new Error('No user logged in');

    const formData = new FormData();
    if (data.fullName) formData.append('fullName', data.fullName);
    if (data.email) formData.append('email', data.email);
    if (data.password) formData.append('password', data.password);
    if (data.avatar) formData.append('avatar', data.avatar);

    return this.http.patch(`${this.apiUrl}/${user.sub}`, formData, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  getAvatar(userId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/${userId}/avatar`, {
      responseType: 'blob',
      headers: { Authorization: `Bearer ${this.getToken()}` },
    }).pipe(
      map(blob => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }),
      switchMap(promise => promise)
    );
  }
}



























