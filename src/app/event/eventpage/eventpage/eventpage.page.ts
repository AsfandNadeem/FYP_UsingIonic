import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../../post/post.model';
import {Subscription} from 'rxjs';
import {EventsService} from '../../events.service';
import {AuthServiceService} from '../../../auth/auth-service.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-eventpage',
  templateUrl: './eventpage.page.html',
  styleUrls: ['./eventpage.page.scss'],
})
export class EventpagePage implements OnInit {

    posts: Post[] = [];
    // groups: Group[] = [];
    // events: Events[] = [];
    userIsAuthenticated = false;
    private postsSub: Subscription;
    private authStatusSub: Subscription;
    @Input() eventid: string;
    private username: string;
    isLoading = false;
    eventname: string;
    eventdate: Date;
    eventdescription: string;
    eventcreator: string;
    // private groupsSub: Subscription;
    // private eventsSub: Subscription;
    private userId: string;
  constructor(public eventService: EventsService, public authService: AuthServiceService, public route: ActivatedRoute) { }

  ngOnInit() {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
          if (paramMap.has('eventId')) {
              this.eventid = paramMap.get('eventId');
              console.log(this.eventid);
              this.getPosts();
          }
      });

      this.isLoading = true;
      this.userId = this.authService.getUserId();
      // this.username = this.authService.getName();
      this.postsSub = this.eventService.getPostUpdateListener()
          .subscribe((postData: {  eventmembers: any, eventname: any, eventdate: Date,
              description: string, eventcreator: string, posts: Post[]}) => {
              this.isLoading = false;
              //     this.totalGroups = eventData.eventCount;
              this.username = this.authService.getName();
              this.posts = postData.posts;
              // this.eventMembers = postData.eventmembers;
              this.eventname = postData.eventname,
                  this.eventdate = postData.eventdate,
                  this.eventdescription = postData.description,
                  this.eventcreator = postData.eventcreator,
                  console.log('eventname' + this.eventname);
              console.log(this.posts);
              // console.log(this.eventMembers);
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
        this.eventService.getPosts(this.eventid);
    }

    onSavePost(form: NgForm) {
        // console.log(this.form.value.title, this.form.value.content,  this.form.value.cname);
        if (form.invalid) {
            return;
        }
        if (form.value.title == null) {
            return;
        }
        this.isLoading = true;
        this.eventService.addPost(this.eventid, form.value.title,
            form.value.content, form.value.image).subscribe( () => {
            // this.socket.emit('refresh', {});
            this.eventService.getPosts(this.eventid);
        });
        form.reset();
    }

    likePost(postid: string) {
        console.log(postid + ' ' + this.eventid);
        this.eventService.likePost(postid, this.eventid).subscribe( () => {
            // this.socket.emit('refresh', {});
            this.eventService.getPosts(this.eventid);
        });
    }

    dislikePost(postid: string) {
        console.log(postid + ' ' + this.eventid);
        this.eventService.dislikePost(postid, this.eventid).subscribe( () => {
            // this.socket.emit('refresh', {});
            this.eventService.getPosts(this.eventid);
        });
    }

    addComment(postid: string, comment: string) {
        console.log(postid + '\n' + comment + '\n' + this.eventid );
        if (comment === '') {
            return;
        } else {
            this.eventService.addComment(postid, this.eventid, comment).subscribe(() => {
                // this.socket.emit('refresh', {});
                this.eventService.getPosts(this.eventid);
            });
        }
    }
}
