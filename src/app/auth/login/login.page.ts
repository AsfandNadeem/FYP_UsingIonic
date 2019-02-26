import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs';
import {AuthServiceService} from '../auth-service.service';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService: AuthServiceService) { }

  ngOnInit() {
  }

  login(form: NgForm) {
    console.log(form.value.email + ' ' + form.value.password );
    this.authService.login(form.value.email, form.value.password);
  }

}
