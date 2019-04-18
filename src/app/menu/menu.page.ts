import { Component, OnInit } from '@angular/core';
import {Router, RouterEvent} from '@angular/router';
import {AuthServiceService} from '../auth/auth-service.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

    pages = [
        {
            title: 'Posts',
            url: '/menu/menu/Posts'
        },
        {
            title: 'Groups',
            url: '/menu/menu/Groups'
        },
        {
            title: 'Events',
            url: '/menu/menu/Events'
        },
        {
            title: 'Archives',
            url: '/menu/menu/Archives'
        }
    ];

    selectedPath = '';
    profileimg: string;
    username = '';
    title = '';

    constructor(private router: Router, private authService: AuthServiceService) {
        this.router.events.subscribe((event: RouterEvent) => {
            this.selectedPath = event.url;
        });
    }

  ngOnInit() {
        this.profileimg = localStorage.getItem('profileimg');
        this.username = localStorage.getItem('username');
      this.router.navigate(['/menu/menu/Posts']);
  }

  logout() {
      this.authService.logout();
      // this.username = null;
  }


}
