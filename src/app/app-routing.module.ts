import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from './auth/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuardService]},
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './auth/register/register.module#RegisterPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule', canActivate: [AuthGuardService] },
  { path: 'eventpage/:eventId', loadChildren: './event/eventpage/eventpage/eventpage.module#EventpagePageModule',
      canActivate: [AuthGuardService] },
  { path: 'grouppage/:groupId', loadChildren: './group/grouppage/grouppage/grouppage.module#GrouppagePageModule',
      canActivate: [AuthGuardService]},
  { path: 'userpage/:userId', loadChildren: './post/userspage/userpage/userpage.module#UserpagePageModule',
      canActivate: [AuthGuardService]},
  { path: 'chatpage/:userId', loadChildren: './chatpage/chatpage.module#ChatpagePageModule' },
  { path: 'comments/:postId', loadChildren: './comments/comments.module#CommentsPageModule', canActivate: [AuthGuardService] },
  { path: 'groupcomments/:groupId/:postId', loadChildren: './groupcomments/groupcomments.module#GroupcommentsPageModule' },
  { path: 'eventscomments/:eventId/:postId', loadChildren: './eventscomments/eventscomments.module#EventscommentsPageModule' },
  // { path: 'event', loadChildren: './event/event.module#EventPageModule' },
  // { path: 'post', loadChildren: './post/post.module#PostPageModule' },
  // { path: 'group', loadChildren: './group/group.module#GroupPageModule' },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
// @ts-ignore
export class AppRoutingModule { }
