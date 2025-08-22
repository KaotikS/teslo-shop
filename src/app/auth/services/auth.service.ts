import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'anonymous'
const baseUrl = environment.baseUrl

@Injectable({providedIn: 'root'})
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking')
  private _user = signal<User | null>(null)
  private _token = signal<string | null>(localStorage.getItem('token'))

  private http = inject(HttpClient)

  checkStatusResource = rxResource({
    stream: () => this.checkAuthStatus()
  })

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking'

    if (this._user()) return 'authenticated'

    return 'anonymous'
  })

  user = computed(() => this._user())

  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false)

  token  = computed(() => this._token())

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email: email,
      password: password
    }).pipe(
      tap(resp => this.handleLogin(resp)),
      map(() => true),
      catchError((error: any) => this.handleError(error))
    )
  }

  register(fullName: string, email: string, password: string) {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`, {
      fullName: fullName,
      email: email,
      password: password,
    }).pipe(
      tap(resp => this.handleLogin(resp)),
      map(() => true),
      catchError((error: any) => this.handleError(error))
    )
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token')

    if (!token) {
      this.logout()
      of(false)
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
      //headers: {
      //  Authorization: `Bearer ${token}`
      //}
    }).pipe(
      map(resp => this.handleLogin(resp)),
      catchError((error: any) => this.handleError(error))
    )
  }

  logout() {
    this._authStatus.set('anonymous')
    this._token.set(null)
    this._user.set(null)
    localStorage.removeItem('token')
  }

  private handleLogin({ user, token }: AuthResponse) {
    this._user.set(user)
    this._authStatus.set('authenticated')
    this._token.set(token)
    localStorage.setItem('token', token)

    return true
  }

  private handleError(error: any) {
    this.logout()
    return of(false)
  }
}
