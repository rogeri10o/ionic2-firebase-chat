import { Chat } from './../../models/chat.model';
import { ChatServive } from './../../providers/chat.service';
import { ChatPage } from './../chat/chat';
import { AuthService } from './../../providers/auth.service';
import { UserService } from './../../providers/user.service';
import { User } from './../../models/user.model';
import { FirebaseListObservable } from 'angularfire2';
import { SignupPage } from './../signup/signup';
import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  users: FirebaseListObservable<User[]>;
  chats: FirebaseListObservable<Chat[]>;

  view: string = 'chats';
  
  constructor(
    public authService: AuthService, 
    public chatService: ChatServive,
    public menuCtrl: MenuController,
    public navCtrl: NavController, 
    public userService: UserService) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.autenticated;
  }

  ionViewDidLoad() {
    this.chats = this.chatService.chats;
    this.users = this.userService.users;

    this.menuCtrl.enable(true, 'user-menu');
  }

  filterItems(event: any): void {
    let searchTerm: string = event.target.value;

    this.chats = this.chatService.chats;
    this.users = this.userService.users;

    if (searchTerm) {
      switch(this.view) {
        case 'chats':
          this.chats = <FirebaseListObservable<Chat[]>>this.chats
            .map((chats: Chat[]) => {
              return chats.filter((chat: Chat) => {
                return (chat.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
              });
            });
          break;
        case 'users': 
            this.users = <FirebaseListObservable<User[]>>this.users
              .map((users: User[]) => {
                return users.filter((user: User) => {
                  return (user.name.toLowerCase().lastIndexOf(searchTerm.toLowerCase()) > -1);
                })
              })
            break;
      }
    }
  }

  onChatCreate(recipientUser: User): void {
    
    this.userService.currentUser
      .first()
      .subscribe((currentUser: User) => {
        this.chatService.getDeepChat(currentUser.$key, recipientUser.$key)
          .first()
          .subscribe((chat: Chat) => {
            console.log('Chat: ', chat);
            if (chat.hasOwnProperty('$value')) {
              let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;

              let chat1: Chat = new Chat('', timestamp, recipientUser.name, '');
              this.chatService.create(chat1, currentUser.$key, recipientUser.$key);

              let chat2: Chat = new Chat('', timestamp, currentUser.name, '');
              this.chatService.create(chat2, recipientUser.$key, currentUser.$key);              
            }
          }); // /users/id1/id2
      })

    this.navCtrl.push(ChatPage, {
      recipientUser: recipientUser
    });
  }

  onChatOpen(chat: Chat): void {
    let recipientUserId: string = chat.$key;

    this.userService.get(recipientUserId)
      .first()
      .subscribe((user: User) => {
        this.navCtrl.push(ChatPage, {
          recipientUser: user
        });
      })
  }

  onSignup(): void {
    this.navCtrl.push(SignupPage);
  }

}
