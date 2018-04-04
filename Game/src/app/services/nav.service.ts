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
    return this.http.get(this.apiUrl +`getNotifications?playerId=${playerId}`)
    .map(res => 
      res.json()); 
  }

  public deleteNotification(notificationId:Number){
    let headers = new Headers ({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.apiUrl+`deleteNotification?`,JSON.stringify(
      {'notificationId':notificationId}),options)
    .map(res => 
      res.json()); 
  }

  public invitationAnswer(invitationId:Number, decision:Boolean){
    let headers = new Headers ({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.apiUrl+`invitationAnswer?`,JSON.stringify(
      {'invitationId':invitationId,'decision':decision}),options)
    .map(res => 
      res.json()); 
  }

}
