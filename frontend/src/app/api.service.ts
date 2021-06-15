import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  apiUrl: string = environment.apiUrl ? environment.apiUrl : 'http://localhost:8000/api'

  constructor(private http: HttpClient) { }

  getMe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/me`, this.httpOptions);
  }

  // updateMe(): Observable<any> {
  //   return this.http.patch(`${this.apiUrl}/users/me`, 'update');
  // }

  getUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`, this.httpOptions);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/`, this.httpOptions);
  }

  getInstances(): Observable<any> {
    return this.http.get(`${this.apiUrl}/instances`, this.httpOptions);
  }

  addInstance(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/instances`, { id }, this.httpOptions);
  }

  deleteInstance(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/instances/${id}`, this.httpOptions);
  }

  getInstanceState(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/instance-state/${id}`, this.httpOptions);
  }

  getMyInstances(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-instances`, this.httpOptions);
  }

  toggleInstance(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/my-instances`, { id }, this.httpOptions);
  }

  updateUser(id: string, instances: string[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}`, {id, instances}, this.httpOptions);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, this.httpOptions);
  }

  login(username: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post(`${this.apiUrl}/login/`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded'),
        withCredentials: true
      },
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout/`, '', this.httpOptions);
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, {email, password}, this.httpOptions);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password/`, {email}, this.httpOptions);
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password/`, {token, password}, this.httpOptions);
  }

  requestVerifyToken(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-verify-token/`, {email}, this.httpOptions);
  }

  verify(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify/`, {token}, this.httpOptions);
  }
}

