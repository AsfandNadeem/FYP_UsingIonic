import {Component, OnInit} from '@angular/core';
import {Router, RouterEvent} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

    pages = [
        {
            title: 'Posts',
            url: '/home/post'
        },
        {
            title: 'Groups',
            url: '/home/group'
        }
    ];

    selectedPath = '';

    constructor(private router: Router) {
        this.router.events.subscribe((event: RouterEvent) => {
            this.selectedPath = event.url;
        });
    }

    ngOnInit() {

    }


}
