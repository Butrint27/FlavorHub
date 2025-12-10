import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // adjust path if needed

export interface CreateLikeDto {
  userId?: number; // optional; filled from JWT if missing
  repositoryId: number;
  isLiked: boolean;
}

export interface UpdateLikeDto {
  userId?: number;
  repositoryId?: number;
  isLiked?: boolean;
}

export interface Like {
  id: number;
  user: any;
  repository: any;
  isLiked: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private baseUrl = 'http://localhost:3000/likes'; // backend endpoint

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  // CREATE or toggle like (fills userId from JWT if missing)
  create(data: CreateLikeDto): Observable<Like> {
    const userFromStorage = this.auth.getUser();
    const payload: CreateLikeDto = {
      userId: data.userId ?? userFromStorage?.sub,
      repositoryId: data.repositoryId,
      isLiked: data.isLiked
    };

    if (!payload.userId) return throwError(() => new Error('No authenticated user found'));

    return this.http.post<Like>(this.baseUrl, payload, { headers: this.getAuthHeaders() })
      .pipe(catchError(err => throwError(() => err)));
  }

  // Toggle like (inverts current UI state)
  toggle(repositoryId: number, currentState: boolean): Observable<Like> {
    return this.create({ repositoryId, isLiked: !currentState });
  }

  // GET all likes for logged-in user
  getLikesByUser(): Observable<Like[]> {
    const userFromStorage = this.auth.getUser();
    if (!userFromStorage?.sub) return throwError(() => new Error('No authenticated user'));
    return this.http.get<Like[]>(`${this.baseUrl}/user/${userFromStorage.sub}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(err => throwError(() => err)));
  }

  // Optional CRUD
  findAll(): Observable<Like[]> {
    return this.http.get<Like[]>(this.baseUrl, { headers: this.getAuthHeaders() })
      .pipe(catchError(err => throwError(() => err)));
  }

  findOne(id: number): Observable<Like> {
    return this.http.get<Like>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(err => throwError(() => err)));
  }

  update(id: number, dto: UpdateLikeDto): Observable<Like> {
    return this.http.patch<Like>(`${this.baseUrl}/${id}`, dto, { headers: this.getAuthHeaders() })
      .pipe(catchError(err => throwError(() => err)));
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(err => throwError(() => err)));
  }
}


