import { Injectable } from '@angular/core';
import { Http,RequestOptions,RequestOptionsArgs, Headers} from '@angular/http';
import {HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SessionStadisticsService {

  private apiUrl: string ='http://localhost:8081/';

  constructor(private http:Http) { }

  public getSessionNames(sessionId:Number)
  {    
    return this.http.get(this.apiUrl +`sessionPlayersName?idSession=${sessionId}`)
    .map(res => 
      res.json()); 
  }

  public passTurn (sessionId:Number){
    return this.http.get(this.apiUrl +`passTurn?idSession=${sessionId}`)
    .map(res => 
      res.json()); 
  }

  public giveUp(sessionId:Number,playerId:Number,currentGameNumber:Number, amountGame:Number){
    return this.http.get(this.apiUrl +`surrender?idSession=${sessionId}&idPlayer=${playerId}&amountGame=${amountGame}
      &currentGame=${currentGameNumber}`)
    .map(res => 
      res.json()); 
  }

  public getStadistics(sessionId:Number){
    return this.http.get(this.apiUrl +`getSessionStadistics?idSession=${sessionId}`)
    .map(res => 
      res.json()); 
  }

}
