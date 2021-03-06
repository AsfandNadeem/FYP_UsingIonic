import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthServiceService} from '../auth/auth-service.service';
import {MessageserviceService} from '../messageservice.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.page.html',
  styleUrls: ['./chatpage.page.scss'],
})
export class ChatpagePage implements OnInit, AfterViewInit {
    @ViewChild('content') private content: any;
    messagesArray = [];
    receiverId: string;
    user: any;
    message: string;
    private authStatusSub: Subscription;
    userId: string;
    receivername = 'abbas';
    userIsAuthenticated = false;
    socket: any;
    typingMessage;
    typing = false;
  constructor(private authService: AuthServiceService,
              private messageService: MessageserviceService,
              public route: ActivatedRoute) {
      this.socket = io('http://localhost:3000');
  }

    ngOnInit() {
      this.scrollToBottomOnInit();
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
                this.userId = this.authService.getUserId();
            });

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('userId')) {
                this.receiverId = paramMap.get('userId');
                console.log(this.receiverId);
                this.GetAllMessages(this.receiverId);
                this.scrollToBottomOnInit();

            }
        });


        this.socket.on('refreshpage', () => {
            console.log('socket done');
            this.route.paramMap.subscribe((paramMap: ParamMap) => {
                if (paramMap.has('userId')) {
                    this.receiverId = paramMap.get('userId');
                    console.log(this.receiverId);
                    this.GetAllMessages(this.receiverId);

                }
            });
            this.GetAllMessages(this.receiverId);
        });

        this.socket.on('is_typing', data => {
            if (data.sender === this.receiverId) {
                this.typing = true;
            }

        });

        this.socket.on('has_stopped_typing', data => {
            if (data.sender === this.receiverId) {
                this.typing = false;
            }

        });
    }

    ngAfterViewInit() {
        const params = {
            room1: this.userId,
            room2: this.receiverId,
        };

        this.socket.emit('join chat', params);
        this.scrollToBottomOnInit();
    }

    IsTyping() {
        console.log('Typing a message');
        this.socket.emit('start_typing', {
            sender: this.userId,
            receiver: this.receiverId
        });

        if (this.typingMessage) {
            clearTimeout(this.typingMessage);
        }
        this.typingMessage = setTimeout(() => {
            this.socket.emit('stop_typing', {
                sender: this.userId,
                receiver: this.receiverId
            });
        }, 500);
    }

    SendMessage() {
        if (this.message === '') {
            return;
        }
        this.messageService.SendMessage(this.userId, this.receiverId, this.receivername, this.message)
            .subscribe(data => {
                console.log(data);
                this.socket.emit('refresh', {});
                this.message = '';
            });
    }

    GetAllMessages(recevierId) {
        this.userId = this.authService.getUserId();
        this.messageService.GetAllMessage(this.userId, recevierId)
            .subscribe(data => {
                this.messagesArray = data.messages.message;
                console.log(this.messagesArray);

                this.receivername = data.usernamechat;
                console.log(this.receivername);
            });
        this.scrollToBottomOnInit();
    }

    scrollToBottomOnInit() {
        setTimeout(() => {
            this.content.scrollToBottom(300);
        }, 200);
    }

}
