import { Injectable } from '@angular/core';
import { Http,RequestOptions,RequestOptionsArgs, Headers} from '@angular/http';
import {HttpHeaders} from '@angular/common/http';

import 'rxjs/add/operator/map';


@Injectable()
export class NavService {

  private apiUrl: string ='http://localhost:8081/';

  constructor(private http:Http) { 

  }

  public getNotifications (playerId:Number){
    return this.http.get(this.apiUrl +`getNotifications?idPlayer=${playerId}`)
    .map(res => 
      res.json()); 
  }

  public deleteNotification(notificationId:Number){
    
    return this.http.get(this.apiUrl+`deleteNotifications?idNotification=${notificationId}`)
    .map(res => 
      res.json()); 
  }

  public invitationAnswer(invitationId:Number, decision:Boolean){
 
    return this.http.get(this.apiUrl+`decideInvitation?idInvitation=${invitationId}
    +&decision=${decision}`)
    .map(res => 
      res.json()); 
  }

  public getInvitations(playerId:Number){
    return this.http.get(this.apiUrl +`getInvitations?idPlayer=${playerId}`)
    .map(res => 
      res.json()); 
  }

  public getMessages(sessionId: Number){
    return this.http.get(this.apiUrl +`getMessages?idSession=${sessionId}`)
    .map(res => 
      res.json()); 
  }

  public sendMessage(sessionId:Number, playerId:Number,content:String){
    return this.http.get(this.apiUrl +`sendMessage?idSession=${sessionId}+
    &idPlayer=${playerId}+&content=${content}`)
    .map(res => 
      res.json()); 
  }

  public closeSession(playerId:Number){
    return this.http.get(this.apiUrl +`getCloseSession?idPlayer=${playerId}`)
    .map(res => 
      res.json()); 
  }


}
