import { Injectable } from '@angular/core';
import { Http,RequestOptions,RequestOptionsArgs, Headers} from '@angular/http';
import {HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs/Rx"
import 'rxjs/add/operator/map';

@Injectable()
export class SessionStadisticsService {

  private apiUrl: string ='http://localhost:8081/';

  constructor(private http:Http) { }

  public getSessionNames(sessionId:Number)
  {    
    return this.http.get(this.apiUrl +`sessionPlayersName?idSesion=${sessionId}`)
    .map(res => 
      res.json()); 
  }

  public passTurn (sessionId:Number){
    return this.http.get(this.apiUrl +`passTurn?idSesion=${sessionId}`)
    .map(res => 
      res.json()); 
  }

  public giveUp(sessionId:Number){
    return this.http.get(this.apiUrl +`surrender?idSesion=${sessionId}`)
    .map(res => 
      res.json()); 
  }

  public getStadistics(sessionId:Number){
    return this.http.get(this.apiUrl +`getSessionStadistics?idSesion=${sessionId}`)
    .map(res => 
      res.json()); 
  }

}
