import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  id: number;
  content: string;
  userId: number;
  repositoryId: number;
  user?: any;       // optional, you can type properly if needed
  repository?: any; // optional
}

export interface CreateCommentDto {
  content: string;
  userId: number;
  repositoryId: number;
}

export interface UpdateCommentDto {
  content?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private baseUrl = 'http://localhost:3000/comments'; // backend URL

  constructor(private http: HttpClient) {}

  // CREATE COMMENT
  createComment(dto: CreateCommentDto): Observable<Comment> {
    return this.http.post<Comment>(this.baseUrl, dto);
  }

  // GET ALL COMMENTS
  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.baseUrl);
  }

  // GET SINGLE COMMENT BY ID
  getComment(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.baseUrl}/${id}`);
  }

  // GET COMMENTS BY REPOSITORY ID
  getCommentsByRepository(repositoryId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/repository/${repositoryId}`);
  }

  // UPDATE COMMENT
  updateComment(id: number, dto: UpdateCommentDto): Observable<Comment> {
    return this.http.patch<Comment>(`${this.baseUrl}/${id}`, dto);
  }

  // DELETE COMMENT
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

