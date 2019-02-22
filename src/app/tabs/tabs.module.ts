import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import {PostPage} from '../post/post.page';
import {GroupPage} from '../group/group.page';
import {PostPageModule} from '../post/post.module';
import {GroupPageModule} from '../group/group.module';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
      children: [
          {
            path: 'post',
              // outlet: 'post',
              component: PostPage
          },
          {
            path: 'group',
              // outlet: 'group',
              component: GroupPage
          }
      ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
      PostPageModule,
      GroupPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
