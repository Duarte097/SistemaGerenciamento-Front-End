import { Component, Input, OnInit } from '@angular/core';
import { LoginDatas } from 'src/app/models/interfaces/Login';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.css']
})
export class LoginCardComponent implements OnInit{
  @Input() loginDatasInput!: LoginDatas;
  ngOnInit(): void {
    console.log("Deu certo", this.loginDatasInput);
  }
}
