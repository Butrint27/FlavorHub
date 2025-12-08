import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RepositoryService {
  private apiUrl = 'http://localhost:3000/repository';

  constructor(private http: HttpClient) {}

  // Fetch all repositories
  getAllRepositories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  // Fetch one repository by ID
  getRepository(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Fetch repositories for a specific user
  getRepositoriesByUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }

  createRepository(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  updateRepository(id: number, formData: FormData): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, formData);
  }

  deleteRepository(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}








