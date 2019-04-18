import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../../post/post.model';
import {Subscription} from 'rxjs';
import {GroupsService} from '../../groups.service';
import {AuthServiceService} from '../../../auth/auth-service.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-grouppage',
  templateUrl: './grouppage.page.html',
  styleUrls: ['./grouppage.page.scss'],
})
export class GrouppagePage implements OnInit {
    posts: Post[] = [];
    userIsAuthenticated = false;
    private postsSub: Subscription;
    private authStatusSub: Subscription;
    @Input() groupid: string;
    groupname: string;
    groupdescription: string;
    groupcreator: string;
    groupcreatorid: string;
    private userId: string;
    private username: string;
   public isLoading: false;
  constructor(public groupsService: GroupsService,
    private authService: AuthServiceService, public route: ActivatedRoute) { }

  ngOnInit() {

      this.route.paramMap.subscribe((paramMap: ParamMap) => {
          if (paramMap.has('groupId')) {
              this.groupid = paramMap.get('groupId');
              console.log(this.groupid);
              this.getPosts();
          }
      });

      // this.isLoading = true;
      this.userId = this.authService.getUserId();
      // this.username = this.authService.getName();
      this.postsSub = this.groupsService.getPostUpdateListener()
          .subscribe((postData: {  groupcreatorid: any, groupmembers: any, groupname: any,
              description: string, groupcreator: string, grouprequests: any, posts: Post[]}) => {
              this.isLoading = false;
              //     this.totalGroups = groupData.groupCount;
              this.username = this.authService.getName();
              this.posts = postData.posts;
              // this.groupMembers = postData.groupmembers;
              // this.groupRequests = postData.grouprequests;
              this.groupname = postData.groupname,
                  this.groupcreatorid = postData.groupcreatorid,
                  this.groupdescription = postData.description,
                  this.groupcreator = postData.groupcreator,
                  console.log(this.posts);
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
    getPosts() {
        this.groupsService.getPosts(this.groupid);
    }

    onSavePost(form: NgForm) {
        // console.log(this.form.value.title, this.form.value.content,  this.form.value.cname);
        if (form.invalid) {
            return;
        }
        if (form.value.title == null) {
            return;
        }
        // this.isLoading = true;
        this.groupsService.addPost(this.groupid, form.value.title,
            form.value.content, form.value.image).subscribe( () => {
            // this.socket.emit('refresh', {});
            this.groupsService.getPosts(this.groupid);
        });
        form.reset();
    }

    likePost(postid: string) {
        console.log(postid + ' ' + this.groupid);
        this.groupsService.likePost(postid, this.groupid).subscribe( () => {
            // this.socket.emit('refresh', {});
            this.groupsService.getPosts(this.groupid);
        });
    }

    dislikePost(postid: string) {
        console.log(postid + ' ' + this.groupid);
        this.groupsService.dislikePost(postid, this.groupid).subscribe( () => {
            // this.socket.emit('refresh', {});
            this.groupsService.getPosts(this.groupid);
        });
    }

    addComment(postid: string, comment: string) {
        console.log(postid + '\n' + comment + '\n' + this.groupid );
        if (comment === '') {
            return;
        } else {
            this.groupsService.addComment(postid, this.groupid, comment).subscribe(() => {
                // this.socket.emit('refresh', {});
                this.groupsService.getPosts(this.groupid);
            });
        }
    }

    leaveGroup(id: string) {
        console.log(id);
        this.groupsService.leaveGroup(id, this.groupid);
    }
}
