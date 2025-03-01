import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { CookieService } from 'ngx-cookie-service';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse copy';
import { SignupUserRequest } from '../../models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthRequest } from 'src/app/models/interfaces/user/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/AuthResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private cookie: CookieService) {}

  private getHeaders() {
    const token = this.cookie.get('USER_INFO');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  getAllUsers(): Observable<Array<GetAllUsersResponse>> {
    return this.http.get<Array<GetAllUsersResponse>>(
      `${this.API_URL}/users`,
      this.getHeaders() // Atualizando os headers dinamicamente
    );
  }


  signupUser(requestDatas: SignupUserRequest): Observable<SignupUserResponse> {
    return this.http.post<SignupUserResponse>(`${this.API_URL}/register`, requestDatas);
  }

  authUser(requestDatas: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, requestDatas);
  }

  isLoggedIn(): boolean {
    const token = this.cookie.get('USER_INFO');
    return !!token; // 🔹 Forma mais enxuta de verificar se o token existe
  }
}
