import { Injectable } from '@angular/core';
import { Http,RequestOptions,RequestOptionsArgs, Headers} from '@angular/http';
import {HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GameServicesService {

  private apiUrl: string ='http://localhost:8081/';
  

  constructor(private http:Http) { }

  public getUpdatedBoard(sessionId:Number)
  {    
    return this.http.get(this.apiUrl +`getBoard?idSession=${sessionId}`)
    .map(res => 
      res.json()); 
  }

  public makeMove(row:Number,column:Number, sessionId:Number,playerId:Number){
    return this.http.get(this.apiUrl +`checkMovement?idSession=${sessionId}+&idPlayer=${playerId}+&row=${row}+&column=${column}`)
    .map(res => 
      res.json()); 
  }

}
