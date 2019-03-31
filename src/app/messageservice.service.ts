import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const BASEUURL = 'http://localhost:3000/api/chat';
@Injectable({
  providedIn: 'root'
})
export class MessageserviceService {

  constructor(private http: HttpClient) { }

    SendMessage( senderId, receiverId, receiverName, message): Observable<any> {
        return this.http
            .post(`${BASEUURL}/chat-messages/${senderId}/${receiverId}`, {
                receiverId,
                receiverName,
                message
            });
    }

    GetAllMessage( senderId, receiverId): Observable<any> {
        return this.http
            .get(`${BASEUURL}/chat-messages/${senderId}/${receiverId}`);
    }
}
