// src/app/services/likes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Like {
  id: number;
  user: { id: number; name?: string }; // adjust based on your User DTO
  repository: { id: number; title?: string }; // adjust based on your Repository DTO
  isLiked: boolean;
  createdAt: string;
}

export interface CreateLikeDto {
  userId: number;
  repositoryId: number;
  isLiked: boolean;
}

export interface UpdateLikeDto {
  userId?: number;
  repositoryId?: number;
  isLiked?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private baseUrl = 'http://localhost:3000/likes'; // replace with your NestJS API URL

  constructor(private http: HttpClient) {}

  // Get all likes
  getAllLikes(): Observable<Like[]> {
    return this.http.get<Like[]>(this.baseUrl);
  }

  // Get a single like by ID
  getLike(id: number): Observable<Like> {
    return this.http.get<Like>(`${this.baseUrl}/${id}`);
  }

  // Create a new like
  createLike(createLikeDto: CreateLikeDto): Observable<Like> {
    return this.http.post<Like>(this.baseUrl, createLikeDto);
  }

  // Update an existing like
  updateLike(id: number, updateLikeDto: UpdateLikeDto): Observable<Like> {
    return this.http.patch<Like>(`${this.baseUrl}/${id}`, updateLikeDto);
  }

  // Delete a like
  deleteLike(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
