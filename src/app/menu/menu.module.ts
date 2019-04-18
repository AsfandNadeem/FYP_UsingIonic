import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
      children: [
          {
            path: 'Posts',
              loadChildren: '../post/post.module#PostPageModule'
          },
          {
              path: 'Groups',
              loadChildren: '../group/group.module#GroupPageModule'
          },
          {
              path: 'Events',
              loadChildren: '../event/event.module#EventPageModule'
          },
          {
              path: 'Archives',
              loadChildren: '../post/archivespage/archivespage.module#ArchivespagePageModule'
          }

          // {
          //     path: 'eventpage/:eventId',
          //     loadChildren:  './event/eventpage/eventpage/eventpage.module#EventpagePageModule'
          // },
      ]
  },
    {
      path: '',
        redirectTo: '/menu/Posts'
    }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
