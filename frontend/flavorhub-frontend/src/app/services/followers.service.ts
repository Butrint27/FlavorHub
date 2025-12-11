import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Follower {
  id: number;
  user: any;          // Replace `any` with your User model if available
  followsUser: any;   // Replace `any` with your User model if available
}

export interface CreateFollowerDto {
  userId: number;
  followsUserId: number;
}

export interface UpdateFollowerDto {
  userId?: number;
  followsUserId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FollowersService {

  private readonly API_URL = 'http://localhost:3000/followers'; // ⬅️ Update if needed

  constructor(private http: HttpClient) {}

  // Get all follower records (optional)
  getAll(): Observable<Follower[]> {
    return this.http.get<Follower[]>(this.API_URL);
  }

  // Get all follower records for a specific user (as the follower)
  findByUserId(userId: number): Observable<Follower[]> {
    return this.http.get<Follower[]>(`${this.API_URL}/user/${userId}`);
  }

  // Get all followers of a user (users following this user)
  getFollowersByUserId(userId: number): Observable<Follower[]> {
    return this.http.get<Follower[]>(`${this.API_URL}/user/${userId}/followers`);
  }

  // Get all users this user is following
  getFollowingByUserId(userId: number): Observable<Follower[]> {
    return this.http.get<Follower[]>(`${this.API_URL}/user/${userId}/following`);
  }

  // Create a follower relationship
  create(dto: CreateFollowerDto): Observable<Follower> {
    return this.http.post<Follower>(this.API_URL, dto);
  }

  // Update a follower relationship
  update(id: number, dto: UpdateFollowerDto): Observable<Follower> {
    return this.http.patch<Follower>(`${this.API_URL}/${id}`, dto);
  }

  // Delete a follower relationship
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}

