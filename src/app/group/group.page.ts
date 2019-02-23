import {Component, OnDestroy, OnInit} from '@angular/core';
import { Group } from './group.model';
import { GroupsService } from './groups.service';
import { AuthServiceService } from '../auth/auth-service.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit, OnDestroy {

    groups: Group[] = [];
    isLoading = false;
    totalGroups = 0;
    groupsPerPage = 5;
    currentPage = 1;
    username: string;
    userId: string;
    userIsAuthenticated = false;
    private groupsSub: Subscription;
    private authStatusSub: Subscription;
  constructor(public groupsService: GroupsService, private authService: AuthServiceService) { }

  ngOnInit() {
      this.isLoading = true;
      this.groupsService.getGroups();
      this.userId = this.authService.getUserId();
      this.username = this.authService.getName();
      this.groupsSub = this.groupsService.getGroupUpdateListener()
          .subscribe((groupData: { groups: Group[], groupCount: number}) => {
              this.isLoading = false;
              this.totalGroups = groupData.groupCount;
              this.username = this.authService.getName();
              this.groups = groupData.groups;
              console.log(this.groups);
          });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
          .getAuthStatusListener()
          .subscribe(isAuthenticated => {
              this.userIsAuthenticated = isAuthenticated;
              this.userId = this.authService.getUserId();
          });
  }

    ngOnDestroy() {
        this.groupsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

}
