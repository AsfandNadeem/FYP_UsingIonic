import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventsService} from './events.service';
import {AuthServiceService} from '../auth/auth-service.service';
import {Events} from './event.model';
import {Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit, OnDestroy {
    events: Events[] = [];
    username: string;
    isLoading = false;
    userId: string;
    userIsAuthenticated = false;
    private eventsSub: Subscription;
    private authStatusSub: Subscription;
    categories = ['General', localStorage.getItem('department')];
  constructor(public eventsService: EventsService,
              private authService: AuthServiceService) { }

  ngOnInit() {
      this.isLoading = true;
      this.eventsService.getEvents();
      this.userId = this.authService.getUserId();
      this.username = this.authService.getName();
      this.eventsSub = this.eventsService.getEventUpdateListener()
          .subscribe((eventData: { events: Events[], eventCount: number}) => {
              this.isLoading = false;
              // this.totalEvents = eventData.eventCount;
              this.username = this.authService.getName();
              this.events = eventData.events;
              // console.log(this.events);
          });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
          .getAuthStatusListener()
          .subscribe(isAuthenticated => {
              this.userIsAuthenticated = isAuthenticated;
              this.userId = this.authService.getUserId();
          });
  }

    onSaveEvent(form: NgForm) {
        // console.log(form.value.title + ' ' + form.value.content + ' '
        //     + form.value.cname + ' ' + form.value.eventdate );
        this.eventsService.addEvent(form.value.name, form.value.cname,
            form.value.description, form.value.eventdate, localStorage.getItem('username')).subscribe( () => {
            this.eventsService.getEvents();
        });
        form.reset();
    }

    ngOnDestroy() {
        this.eventsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
    onJoin(id: string) {
        this.eventsService.joinEvent(id);
    }
}
