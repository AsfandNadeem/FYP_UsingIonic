import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from './post.model';
import {Subscription} from 'rxjs';
import {PostsService} from './posts.service';
import {AuthServiceService} from '../auth/auth-service.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit, OnDestroy {

    posts: Post[] = [];
    isLoading = false;
    totalPosts = 0;
    postsPerPage = 5;
    currentPage = 1;
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
      this.isLoading = true;
      this.postsService.getPosts( );
      this.userId = this.authService.getUserId();
      // this.username = this.authService.getName();
      console.log(localStorage.getItem('profileimg'));
      this.profileimg = localStorage.getItem('profileimg');
      this.username =  localStorage.getItem('username');
      this.postsSub = this.postsService.getPostUpdateListener()
          .subscribe((postData: { posts: Post[], postCount: number}) => {
              this.isLoading = false;
              this.totalPosts = postData.postCount;
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

    ngOnDestroy() {
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

}
