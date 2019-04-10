import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from './post.model';
import {Subscription} from 'rxjs';
import {PostsService} from './posts.service';
import {AuthServiceService} from '../auth/auth-service.service';
import {NgForm} from '@angular/forms';

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
    categories = ['General', localStorage.getItem('department')];

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
              // console.log(this.posts);
          });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
          .getAuthStatusListener()
          .subscribe(isAuthenticated => {
              this.userIsAuthenticated = isAuthenticated;
              this.userId = this.authService.getUserId();
          });
  }
    onSavePost(form: NgForm) {
        // console.log(form.value.title + ' ' + form.value.content + ' ' + form.value.cname );
        this.postsService.addPost(form.value.title, form.value.content, form.value.cname).subscribe( () => {
            this.postsService.getPosts();
        });
        form.reset();
    }

    ngOnDestroy() {
        this.posts = null;
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

    likePost(id: string) {
        this.postsService.likePost(id).subscribe( () => {
            // this.socket.emit('refresh', {});
            this.postsService.getPosts();
        });
    }

    dislikePost(id: string) {
        this.postsService.dislikePost(id).subscribe( () => {
            // this.socket.emit('refresh', {});
            this.postsService.getPosts();
        });

    }

    onArchive(id: string) {
        console.log(id);
        this.postsService.archivepost(id).subscribe( () => {
            this.postsService.getPosts();
        });
    }



}
