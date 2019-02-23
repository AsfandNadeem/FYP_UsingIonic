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
            url: '/menu/menu/post'
        },
        {
            title: 'Groups',
            url: '/menu/menu/group'
        }
    ];

    selectedPath = '';

    constructor(private router: Router, private authService: AuthServiceService) {
        this.router.events.subscribe((event: RouterEvent) => {
            this.selectedPath = event.url;
        });
    }

  ngOnInit() {
      this.router.navigate(['/menu/menu/post']);
  }

  logout() {
      this.authService.logout();
      // this.username = null;
  }


}
