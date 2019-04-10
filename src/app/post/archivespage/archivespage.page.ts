import { Component, OnInit } from '@angular/core';
import {Post} from '../post.model';
import {Subscription} from 'rxjs';
import {PostsService} from '../posts.service';
import {AuthServiceService} from '../../auth/auth-service.service';

@Component({
  selector: 'app-archivespage',
  templateUrl: './archivespage.page.html',
  styleUrls: ['./archivespage.page.scss'],
})
export class ArchivespagePage implements OnInit {
    posts: Post[] = [];
    username: string;
    userId: string;
    profileimg: string;
    newComment = [];
    pageSizeOptions = [1, 2, 5, 10];
    userIsAuthenticated = false;
    private postsSub: Subscription;
    private authStatusSub: Subscription;
  constructor(public postsService: PostsService, private authService: AuthServiceService) { }

  ngOnInit() {
      this.postsService.getarchivePosts();
      this.userId = this.authService.getUserId();
      // this.username = this.authService.getName();
      console.log(localStorage.getItem('profileimg'));
      this.profileimg = localStorage.getItem('profileimg');
      this.username =  localStorage.getItem('username');
      this.postsSub = this.postsService.getarchivePostUpdateListener()
          .subscribe((postData: { posts: Post[], postCount: number}) => {
               // this.username = this.authService.getName();
              this.posts = postData.posts;
              console.log(this.posts);
          });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
          .getAuthStatusListener()
          .subscribe(isAuthenticated => {
              this.userIsAuthenticated = isAuthenticated;
              this.userId = this.authService.getUserId();
          });
  }

    likePost(id: string) {
        this.postsService.likePost(id).subscribe( () => {
            this.postsService.getarchivePosts();
        });
    }

    dislikePost(id: string) {
        this.postsService.dislikePost(id).subscribe( () => {
            this.postsService.getarchivePosts();
        });

    }

    onDelete(postId: string) {
        this.postsService.removearchivePost(postId).subscribe(() => {
            this.postsService.getarchivePosts();
        });
    }

}
