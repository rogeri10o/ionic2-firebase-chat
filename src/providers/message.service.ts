import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Message } from './../models/message.model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from "./base.service";

@Injectable()
export class MessageService extends BaseService {

  constructor(
    public af: AngularFire,
    public http: Http) {
    super();
    console.log('Hello Message Provider');
  }

  create(message: Message, listMessages: FirebaseListObservable<Message[]>): firebase.Promise<void> {
    return listMessages.push(message)
      .catch(this.handlePromiseError);
  }

  getMessages(userId1: string, userId2: string): FirebaseListObservable<Message[]> {
    return <FirebaseListObservable<Message[]>>this.af.database.list(`/messages/${userId1}-${userId2}`, {
      query: {
        orderByChild: 'timestamp',
        limitToLast: 50
      }
    }).catch(this.handleObservableError);
  }
}
