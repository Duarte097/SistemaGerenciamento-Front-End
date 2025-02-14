import { UserService } from './../../../service/user/User.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../../service/user/login.service';
import { LoginDatas } from 'src/app/models/interfaces/Login';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthRequest } from 'src/app/models/interfaces/user/AuthRequest';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  loginForm!: FormGroup;
  loginDatas!: LoginDatas;
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router,
    private formBuilder: FormBuilder,
  ){}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  getLoginDatas(nome: string): void {

    this.loginService.getLoginDatas(nome)
    .pipe(
      takeUntil(this.destroy$)
    ).subscribe({next:(response) => {
      response && (this.loginDatas = response);
      console.log(this.loginDatas.username);
    }, error:(error) => {
      console.log(error);
    }
    });
  }

  onSubmit(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService
        .authUser(this.loginForm.value as AuthRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.cookieService.set('USER_INFO', response?.token);
              this.loginForm.reset();
              this.router.navigate(['/dashboard']);

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Bem vindo de volta ${response?.name}!`,
                life: 2000,
              });
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao fazer o login!`,
              life: 2000,
            });
            console.log(err);
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
