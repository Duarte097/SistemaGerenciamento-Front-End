import { SignupUserRequest } from './../../models/interfaces/user/SignupUserRequest';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { AuthRequest } from 'src/app/models/interfaces/user/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/AuthResponse';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}
  signupUser(requestDatas: SignupUserRequest): Observable<SignupUserResponse>{
    return this.http.post<SignupUserResponse>(`${this.API_URL}/signup`, requestDatas);
  }

  authUser(requestDatas:AuthRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.API_URL}/auth`, requestDatas);
  }
}
