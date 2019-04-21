import { Component, OnInit } from '@angular/core';
import {AuthServiceService} from '../auth-service.service';
import {Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    username: string;
    userId: string;
    profileimg: string;
    private profilesSub: Subscription;
    userIsAuthenticated = false;
    private authStatusSub: Subscription;
    // user: User;
    profiles = [
        // {main: 'usernmae',
        // value: 'Asfand'},
        // {main: 'Email',
        //   value: 'asfand@gmail.com'},
        // {main: 'department',
        //   value: 'CS'},
        // {main: 'REG NO',
        //   value: 'FA15-BCS-034'}
    ];
  constructor(public authService: AuthServiceService) { }

  ngOnInit() {
      console.log( 'profileimg' + localStorage.getItem('profileimg'));
      this.profileimg = localStorage.getItem('profileimg');
      // const profileimg1 = localStorage.getItem('profileimg');
      // // @ts-ignore
      // this.profileimg = profileimg1.toString('base64');
      this.username =  localStorage.getItem('username');
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
          .getAuthStatusListener()
          .subscribe(isAuthenticated => {
              this.userIsAuthenticated = isAuthenticated;
              this.userId = this.authService.getUserId();
          });
      this.authService.getProfile();
      this.profilesSub = this.authService.getProfileUpdateListener()
          .subscribe((postData: { email:  any, usernamefetched:  any,  departmentfetched:  any,  registrationofetched:  any}) => {
              this.profiles = [
                  {main: 'Username: ',
                      value: postData.usernamefetched},
                  {main: 'Email:  ',
                      value: postData.email},
                  {main: 'Department:   ',
                      value: postData.departmentfetched},
                  {main: 'REG NO:        ',
                      value: postData.registrationofetched}
              ];
          });
  }

    onEdit(form: NgForm) {
       console.log(form.value.username + '\n' + form.value.password + '\n' + localStorage.getItem('userId'));
        this.authService.updateUser(
            localStorage.getItem('userId'),
           form.value.username,
            form.value.password);
        // this.authService.getProfile();
        form.reset();
    }

}
