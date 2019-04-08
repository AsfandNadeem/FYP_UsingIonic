import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthServiceService} from '../auth/auth-service.service';
import {PostsService} from '../post/posts.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {GroupsService} from '../group/groups.service';
export interface Comment {
    id: string;
    comment: string;
    commentator: string;
    commentatorid: string;
}
@Component({
  selector: 'app-groupcomments',
  templateUrl: './groupcomments.page.html',
  styleUrls: ['./groupcomments.page.scss'],
})
export class GroupcommentsPage implements OnInit, OnDestroy {
    comments: Comment[] = [];
    commentsSub: Subscription;
    message: string;
    public userId: string;
    authStatusSub: Subscription;
    userIsAuthenticated = false;
    username: string;
    public postid: string;
    public groupid: string;
  constructor(private authService: AuthServiceService, public groupService: GroupsService, public route: ActivatedRoute) { }

  ngOnInit() {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
          if (paramMap.has('postId')) {
              this.postid = paramMap.get('postId');
              console.log(this.postid);
              // this.getComments();
          }
      });

      this.route.paramMap.subscribe((paramMap: ParamMap) => {
          if (paramMap.has('groupId')) {
              this.groupid = paramMap.get('groupId');
              console.log(this.groupid);
              this.getComments();
          }
      });
      // this.postsService.getPosts( );
      this.userId = this.authService.getUserId();
      // this.username = this.authService.getName();
      // console.log(localStorage.getItem('profileimg'));
      this.username =  localStorage.getItem('username');
      this.commentsSub = this.groupService.getCommentUpdateListener()
          .subscribe((postData: {comments: Comment[]}) => {
              // this.isLoading = false;
              //     this.totalGroups = groupData.groupCount;
              this.username = this.authService.getName();
              this.comments = postData.comments;
              // this.groupMembers = postData.groupmembers;
              // this.groupRequests = postData.grouprequests;
              // this.groupname = postData.groupname,
              // this.eventdate = postData.eventdate,
              // this.groupdescription = postData.description,
              // this.groupcreator = postData.groupcreator,
              console.log(this.comments);
              // console.log(this.groupMembers);
              // console.log(this.groupRequests);
          });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
          .getAuthStatusListener()
          .subscribe(isAuthenticated => {
              this.userIsAuthenticated = isAuthenticated;
              this.userId = this.authService.getUserId();
          });
  }

    SendMessage() {
        if (this.message === '') {
            return;
        }
        this.groupService.addComment(this.postid, this.groupid, this.message)
            .subscribe(() => {
                this.message = '';
                this.getComments();
            });
        // console.log(id + '\n' + form.value.comment);
        // if (form.invalid) {
        //     return;
        // } else {
        //     // this.postsService.addComment(id, form.value.comment).subscribe(() => {
        //     //     this.socket.emit('refresh', {});
        //     //     this.postsService.getPosts(this.postsPerPage, this.currentPage);
        //     });
        // }

    }

    getComments() {
        console.log('getting comments');
        this.groupService.getComments(this.postid, this.groupid);
    }
    ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.commentsSub.unsubscribe();
    }

}
