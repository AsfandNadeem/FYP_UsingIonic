import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
const BASEUURL = 'http://localhost:3000';
export interface Comment {
    id: string;
    comment: string;
    commentator: string;
    commentatorid: string;
}
@Injectable({providedIn: 'root'})
export class PostsService {
    private comments: Comment[] = [];
    private commentsUpdated = new Subject<{comments: Comment[]}>();
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
    private userposts: Post[] = [];
    private userpostsUpdated = new Subject<{posts: Post[], usern: string, friends: any, requests: any, postCount: number}>();
    private archivedposts: Post[] = [];
    private archivedpostsUpdated = new Subject<{posts: Post[], postCount: number}>();
  constructor(private http: HttpClient, private router: Router) {}

    getuserPosts(userid: string) {
        this.http
            .get<{message: string, posts: any,  usern: string, friends: any, requests: any, maxPosts: number}>(
                `${BASEUURL}/api/posts/user/` + userid
            )
            .pipe(map((postData) => {
                return { posts: postData.posts.map(post => {
                        return {
                            profileimg: post.profileimg,
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            username : post.username,
                            creator: post.creator,
                            likes: post.likes,
                            likedBy: post.likedBy,
                            dislikedBy: post.dislikedBy,
                            category: post.category,
                            commentsNo: post.commentsNo,
                            comments: post.comments,
                            dislikes: post.dislikes,
                            createdAt: post.createdAt,
                            imagePath: post.imagePath
                        };
                    }), usern: postData.usern, friends: postData.friends, requests: postData.requests, maxPosts: postData.maxPosts  };
            }))// change rterieving data
            .subscribe(transformedPostData => {
                this.userposts = transformedPostData.posts;
                this.userpostsUpdated.next({
                        posts: [...this.userposts],
                        usern: transformedPostData.usern,
                        friends: transformedPostData.friends,
                        requests: transformedPostData.requests,
                        postCount: transformedPostData.maxPosts
                    }
                );
            }); // subscribe is to liosten
    }

    getuserPostUpdateListener() {
        return this.userpostsUpdated.asObservable();
    }


  getPosts() { // httpclientmodule
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
   this.http
     .get<{message: string, posts: any,  username: string, maxPosts: number}>(
         `${BASEUURL}/api/posts`
     )
     .pipe(map((postData) => {
       return { posts: postData.posts.map(post => {
         return {
             profileimg: post.profileimg,
             title: post.title,
             content: post.content,
             id: post._id,
             username : post.username,
             creator: post.creator,
             likes: post.likes,
             likedBy: post.likedBy,
             dislikedBy: post.dislikedBy,
             category: post.category,
             commentsNo: post.commentsNo,
             comments: post.comments,
             dislikes: post.dislikes,
             createdAt: post.createdAt,
             imagePath: post.imagePath
         };
       }), maxPosts: postData.maxPosts  };
    }))// change rterieving data
     .subscribe(transformedPostData => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        }
      );
     }); // subscribe is to liosten
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

    getComments(id: string) {
      this.http
            .get<{message: string, comments: any}>(
                `${BASEUURL}/api/posts/comments/` + id
            )
            .pipe(map((postData) => {
                return { comments: postData.comments.map(comments => {
                        return {
                            commentator: comments.commentator,
                            comment: comments.comment,
                            commentatorid: comments.commentatorid
                        };
                    }) };
            }))// change rterieving data
            .subscribe(transformedCommentData => {
                this.comments = transformedCommentData.comments;
                this.commentsUpdated.next({
                        comments: [...this.comments]
                    }
                );
            }); // subscribe is to liosten
    }

    getCommentUpdateListener() {
        return this.commentsUpdated.asObservable();
    }

  addPost(title: string, content: string , category: string) {
    // const postData =  new FormData();
    // postData.append('title', title);
    //   postData.append('content', content);
    // // postData.append('image', image, title);
    // postData.append( 'category', category);
    // postData.append('username', localStorage.getItem('username'));
    // postData.append('profileimg', profileimg);
    // console.log(postData);
   return this.http
      .post<{ message: string, post: Post }>(
          `${BASEUURL}/api/posts/postmobile`,
          {title, content, category});
       }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      username: string,
      category: string,
      creator: string,
      imagePath: string
    }>(`${BASEUURL}/api/posts/` + id) ;
  }

  updatePost(id: string , title: string, content: string, image: File | string) {
    let postData: Post |FormData ;
    if (typeof(image) === 'object') {
       postData = new FormData();
       postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('username', localStorage.getItem('username'));
      postData.append('image', image, title);
    } else {
       postData = {
           id: id,
           title: title,
           content: content,
           category: null,
           creator: null,
           likes: null,
           likedBy: null,
           profileimg: null,
           dislikedBy: null,
           dislikes: null,
           comments: null,
           commentsNo: null,
           createdAt: null,
           username: localStorage.getItem('username'),
           imagePath: image
      };

    }
    this.http.put(`${BASEUURL}/api/posts/` + id, postData)
      .subscribe(response => {
        this.router.navigate(['/messages']);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete(`${BASEUURL}/api/posts/` + postId);
  }

  // postComment(id, comment) {
  //   const postData = {
  //     id: id,
  //     comment: comment
  //   };
  //   return this.http.post('http://localhost:3000/api/posts/comment/' + id, postData);
  // }

  likePost(id) {
    // @ts-ignore
    return this.http.put(`${BASEUURL}/api/posts/likePost/` + id);
  }

  dislikePost(id) {
    // @ts-ignore
    return this.http.put( `${BASEUURL}/api/posts/dislikePost/` + id);
  }

  addComment(id, comment) {
    const postdata = {
      id: id,
      comment: comment
    };
    // @ts-ignore
    return this.http.put( `${BASEUURL}/api/posts/comment/` + id, postdata);
  }

    archivepost(id: string) {
        // @ts-ignore
        return this.http.put( `${BASEUURL}/api/posts/archivePost/` + id);
    }

    removearchivePost(postId: string) {
        return this.http
            .delete(`${BASEUURL}/api/posts/archives/` + postId);
    }

    getarchivePosts() {
      this.http
            .get<{message: string, posts: any,  username: string, maxPosts: number}>(
                `${BASEUURL}/api/posts/archives`
            )
            .pipe(map((postData) => {
                return { posts: postData.posts.map(post => {
                        return {
                            profileimg: post.profileimg,
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            username : post.username,
                            creator: post.creator,
                            likes: post.likes,
                            likedBy: post.likedBy,
                            dislikedBy: post.dislikedBy,
                            category: post.category,
                            commentsNo: post.commentsNo,
                            comments: post.comments,
                            dislikes: post.dislikes,
                            createdAt: post.createdAt,
                            imagePath: post.imagePath
                        };
                    }), maxPosts: postData.maxPosts  };
            }))// change rterieving data
            .subscribe(transformedPostData => {
                this.archivedposts = transformedPostData.posts;
                this.archivedpostsUpdated.next({
                        posts: [...this.archivedposts],
                        postCount: transformedPostData.maxPosts
                    }
                );
            }); // subscribe is to liosten

    }
    getarchivePostUpdateListener() {
        return this.archivedpostsUpdated.asObservable();
    }
}
