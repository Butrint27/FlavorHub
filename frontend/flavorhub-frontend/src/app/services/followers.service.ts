import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Follower {
  id: number;
  user: any;          // you can replace `any` with your User model
  followsUser: any;   // same here
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

  private readonly API_URL = 'http://localhost:3000/followers'; // ⬅️ Change if needed

  constructor(private http: HttpClient) {}

  // Get all followers
  getAll(): Observable<Follower[]> {
    return this.http.get<Follower[]>(this.API_URL);
  }

  // Get follower by ID
  getOne(id: number): Observable<Follower> {
    return this.http.get<Follower>(`${this.API_URL}/${id}`);
  }

  // Get all followers for a specific user
  getFollowersByUserId(userId: number): Observable<Follower[]> {
    return this.http.get<Follower[]>(`${this.API_URL}/user/${userId}/followers`);
  }

  // Get all following for a specific user
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
