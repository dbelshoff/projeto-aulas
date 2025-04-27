import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api/auth';
  private emailSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('email')
  );

  email$ = this.emailSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('email', response.email);
        this.emailSubject.next(response.email);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.emailSubject.next(null);
  }
}
