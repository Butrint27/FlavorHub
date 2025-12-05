import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap, tap } from 'rxjs';
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
        const token = res?.tokens?.access_token || res?.access_token || res?.token || res?.jwt || null;
        if (!token) throw new Error('Invalid credentials');
        localStorage.setItem('access_token', token);

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

  // Fetch user from backend using JWT id
  fetchUser(): Observable<{ fullName: string; email: string; avatar?: string }> {
    const user = this.getUser();
    if (!user) throw new Error('No user logged in');

    return this.http.get<{ fullName: string; email: string; avatar?: string }>(
      `${this.apiUrl}/${user.sub}`,
      { headers: { Authorization: `Bearer ${this.getToken()}` } }
    );
  }

  // Update user info
  updateUser(data: {
    fullName?: string;
    email?: string;
    password?: string;
    avatar?: File;
  }): Observable<any> {
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

  // New method in AuthService
getAvatar(userId: number): Observable<string> {
  return this.http.get(`http://localhost:3000/user/${userId}/avatar`, {
    responseType: 'blob',
    headers: { Authorization: `Bearer ${this.getToken()}` }
  }).pipe(
    // Convert blob to base64 string
    map(blob => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }),
    // Flatten the Promise to Observable
    switchMap(promise => promise)
  );
}

}
























