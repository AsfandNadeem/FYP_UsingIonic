import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from '../../posts.service';
import {AuthServiceService} from '../../../auth/auth-service.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Subscription} from 'rxjs';
import {Post} from '../../post.model';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.page.html',
  styleUrls: ['./userpage.page.scss'],
})
export class UserpagePage implements OnInit, OnDestroy {
    posts: Post[] = [];
    isLoading = false;
    usern: string;
    totalPosts = 0;
    postsPerPage = 5;
    currentPage = 1;
    friends = [];
    requests = [];
    username: string;
    userId: string;
    ownid: string;
    @Input() userid: string;
    profileimg: string;
    newComment = [];
    pageSizeOptions = [1, 2, 5, 10];
    userIsAuthenticated = false;
    private postsSub: Subscription;
    private groupsSub: Subscription;
    private eventsSub: Subscription;
    private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthServiceService,
              public route: ActivatedRoute) { }

    ngOnInit() {
        this.isLoading = true;
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('userId')) {
                this.userid = paramMap.get('userId');
                console.log(this.userid);
                this.getPosts();
            }
        });
        this.postsService.getuserPosts(this.userid);
        this.ownid = this.authService.getUserId();
        // this.username = this.authService.getName();
        console.log(localStorage.getItem('profileimg'));
        this.profileimg = localStorage.getItem('profileimg');
        this.username =  localStorage.getItem('username');
        this.postsSub = this.postsService.getuserPostUpdateListener()
            .subscribe((postData: { posts: Post[], usern: string, friends: any, requests: any, postCount: number}) => {
                this.isLoading = false;
                this.totalPosts = postData.postCount;
                // this.username = this.authService.getName();
                this.usern = postData.usern,
                    this.posts = postData.posts;
                this.friends = postData.friends;
                this.requests = postData.requests;
                console.log(this.posts);
            });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
                this.ownid = this.authService.getUserId();
            });
  }

    // onChangedPage(pageData: PageEvent) {
    //   this.isLoading = true;
    //   this.currentPage = pageData.pageIndex + 1;
    //   this.postsPerPage = pageData.pageSize;
    //   this.postsService.getPosts(this.postsPerPage, this.currentPage );
    // }

    likePost(id: string) {
        this.postsService.likePost(id).subscribe( () => {
            this.postsService.getuserPosts(this.userid);
        });
    }

    getPosts() {
        this.postsService.getuserPosts(this.userid);
    }
    // console.log(this.posts.indexOf(post));
    // this.posts[this.posts.indexOf(post)].likes++;
    // if (this.posts[this.posts.indexOf(post)].dislikes === 0 ) {
    //
    //         } else {
    //   this.posts[this.posts.indexOf(post)].dislikes--;
    // }
    // });
    addComment(id: string, comment: string) {
        console.log(id + '\n' + comment);
        if (comment === '') {
            return;
        } else {
            this.postsService.addComment(id, comment).subscribe(() => {
                this.postsService.getuserPosts(this.userid);
            });
        }

    }


    dislikePost(id: string) {
        this.postsService.dislikePost(id).subscribe( () => {
            this.postsService.getuserPosts(this.userid);
        });

    }

    ngOnDestroy() {
      this.posts = null;
      this.postsSub.unsubscribe();
    }

}
