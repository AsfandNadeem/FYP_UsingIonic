import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import { HomePage } from './home.page';
import {PostPage} from '../post/post.page';


const routes: Routes = [
    {
      path: 'home',
        component: HomePage,
        children: [
            { path: 'post',
            loadChildren: '../post/post.module#PostPageModule'
            },
            {
              path: 'group',
                loadChildren: '../group/group.module#GroupPageModule'
            }
        ]
    },
    {
     path: '',
     redirectTo: '/home/post'
    }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
