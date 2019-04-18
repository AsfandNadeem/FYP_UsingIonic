import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Group} from './group.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Post} from '../post/post.model';
const BASEUURL = 'http://localhost:3000';
export interface Comment {
    id: string;
    comment: string;
    commentator: string;
    commentatorid: string;
}
@Injectable({providedIn: 'root'})
export class GroupsService {
    private comments: Comment[] = [];
    private commentsUpdated = new Subject<{comments: Comment[]}>();
  username = '';
  private groups: Group[] = [];
  private posts: Post[] = [];
    private groupsUpdated = new Subject<{groups: Group[], groupCount: number}>();

    private postsUpdated = new Subject<{posts: Post[], groupcreatorid: any, groupmembers: any, groupname: string,
        description: string, groupcreator: string, grouprequests: any}>();

    constructor(private http: HttpClient, private router: Router) {}


    getPosts(id: string) {
        console.log('inservicee' + id);
        this.http.get<{groupcreatorid: any,
            groupmembers: any, groupname: any, description: any, groupcreator: any, grouprequests: any, posts: any}>
        (`${BASEUURL}/api/groups/` + id)
            .pipe(map((postData) => {
                return { posts: postData.posts.map(post => {
                        return {
                            title: post.title,
                            content: post.content,
                            username : post.username,
                            creator: post.creator,
                            likes: post.likes,
                            likedBy: post.likedBy,
                            dislikedBy: post.dislikedBy,
                            commentsNo: post.commentsNo,
                            comments: post.comments,
                            dislikes: post.dislikes,
                            profileimg: post.profileimg,
                            id: post._id,
                            createdAt: post.createdAt,
                            imagePath: post.imagePath
                        };
                    }), groupcreatorid: postData.groupcreatorid, groupmembers:  postData.groupmembers, groupname: postData.groupname,
                    groupcreator: postData.groupcreator,
                    groupdescription: postData.description, grouprequests: postData.grouprequests};
            }))
            .subscribe( transformedGroupPost => {
                this.posts = transformedGroupPost.posts;
                this.postsUpdated.next( {
                    posts: [...this.posts],
                    groupcreatorid: transformedGroupPost.groupcreatorid,
                    groupmembers: transformedGroupPost.groupmembers,
                    grouprequests: transformedGroupPost.grouprequests,
                    groupname: transformedGroupPost.groupname,
                    description: transformedGroupPost.groupdescription,
                    groupcreator: transformedGroupPost.groupcreator
                });
            }, error => {
                console.log('error');
                this.router.navigate(['/menu/menu/Groups']).then();
            });
    }


  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

    getComments(postid: string, groupid: string) {
        // const queryParams = `?postid=${postid}&groupid=${groupid}`;
        const groupData =  {
            groupid: groupid,
           postid: postid
        };
        this.http
            .get<{message: string, comments: any}>(
                `${BASEUURL}/api/groups/comments/` + groupid + '/' + postid
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

  getGroups() { // httpclientmodule
    // const queryParams = `?pagesize=${groupsPerPage}&page=${currentPage}`; // `` backtips are for dynamically adding values into strings
   this.http
     .get<{message: string, groups: any,  username: string, maxGroups: number}>(
         `${BASEUURL}/api/groups`)
     .pipe(map((groupData) => {
       return { groups: groupData.groups.map(group => {
         return {
             groupname: group.groupname,
             description: group.description,
             id: group._id,
             username : group.username,
             creator: group.groupcreator,
             grouprequests: group.grouprequests,
             grouprequestsid: group.grouprequestsid,
             groupmembers: group.groupmembers,
             groupmembersid: group.groupmembersid,
             category: group.category,
           // imagePath: post.imagePath
         };
       }), maxGroups: groupData.maxGroups  };
    }))// change rterieving data
     .subscribe(transformedGroupData => {
      this.groups = transformedGroupData.groups;
      this.groupsUpdated.next({
          groups: [...this.groups],
          groupCount: transformedGroupData.maxGroups
        }
      );
     }); // subscribe is to liosten
  }


  getJoinedGroups() { // httpclientmodule
  this.http
      .get<{message: string, groups: any,  maxGroups: number}>(
          `${BASEUURL}/api/groups/joinedgroups`)
      .pipe(map((groupData) => {
        return { groups: groupData.groups.map(group => {
            return {
              groupname: group.groupname,
              // description: group.description,
              id: group._id,
              // username : group.username,
              // creator: group.groupcreator,
              // category: group.category,
              // // imagePath: post.imagePath
            };
          }), maxGroups: groupData.maxGroups };
      }))// change rterieving data
      .subscribe(transformedGroupData => {
        this.groups = transformedGroupData.groups;
        this.groupsUpdated.next({
            groups: [...this.groups],
          groupCount: transformedGroupData.maxGroups
          }
        );
       }); // subscribe is to liosten
  }

  deletePost(groupId: string, postId: string) {
    const queryParams = `?groupid=${groupId}&postid=${postId}`;
    return this.http
      .delete(`${BASEUURL}/api/groups/delete` + queryParams);
  }

  getGroupUpdateListener() {
    return this.groupsUpdated.asObservable();
  }

  addGroup(groupname: string,  category: string, description: string, username: string) {
    return this.http
      .post(
          `${BASEUURL}/api/groups`,
        {groupname, description, category, username});
  }

    addPost(id: string, title: string, content: string , image: File) {
        const postData =  new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        // postData.append('username', localStorage.getItem('username'));
        // postData.append('profileimg', profileimg);
        console.log(postData);
        return this.http
            .put<{ message: string }>(
                `${BASEUURL}/api/groups/addgroupPost/` + id,
                postData);
        // .subscribe( responseData  => {
        //   this.router.navigate(['/grouplist']);
        // });
    }

    joinGroup( userid: string, groupid: string) {
        const groupData =  {
            groupid: groupid,
            userid: userid
        };
        // @ts-ignore
        return this.http
            .put<{ message: string }>(
                `${BASEUURL}/api/groups/adduser`, groupData);
    }

    requestGroup( id: string) {
        // return this.http.put( 'http://localhost:3000/api/posts/dislikePost/' + id);
        // @ts-ignore
        return this.http
            .put(
                `${BASEUURL}/api/groups/requestuser/` + id);
    }

    likePost(postid: string, groupid: string) {
        const groupData =  {
            groupid: groupid,
            postid: postid
        };
        // @ts-ignore
        return this.http.put( `${BASEUURL}/api/groups/likegrouppost/` + groupid, groupData);
    }
    //
    dislikePost(postid: string, groupid: string) {
        const groupData =  {
            groupid: groupid,
            postid: postid
        };
        // @ts-ignore
        return this.http.put( `${BASEUURL}/api/groups/dislikegrouppost/` + groupid, groupData);
    }

    addComment(postid: string, groupid: string, comment: string) {
        const groupData =  {
            groupid: groupid,
            postid: postid,
            comment: comment
        };
        // @ts-ignore
        return this.http.put( `${BASEUURL}/api/groups/commentgrouppost/` + groupid, groupData);
    }

    leaveGroup( userid: string, groupid: string) {
        const groupData =  {
            groupid: groupid,
            userid: userid
        };
        // @ts-ignore
        return this.http
            .put<{ message: string }>(
                `${BASEUURL}/api/groups/leavegroup/` + groupid, groupData)
            .subscribe( responseData  => {
                this.router.navigate(['/menu/menu/Groups']);
            });
    }
}
