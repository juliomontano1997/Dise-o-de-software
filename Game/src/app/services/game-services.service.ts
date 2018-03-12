import { Injectable } from '@angular/core';
import { Http,RequestOptions,RequestOptionsArgs, Headers} from '@angular/http';
import {HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs/Rx"
import 'rxjs/add/operator/map';

@Injectable()
export class GameServicesService {

  private apiUrl: string ='http://localhost:8081/';
  

  constructor(private http:Http) { }

  public getUpdatedBoard(sessionId:Number,idJugador: Number)
  {    
    return this.http.get(this.apiUrl +`primeraPrueba?name=${sessionId}`)
    .map(res => 
      res.json()); 
  }

  public makeMove(row:Number,column:Number, sessionId:Number,playerId:Number){
    let headers = new Headers ({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.apiUrl+`primeraPrueba?`,JSON.stringify({'row':row,'column':column,'sessionId':sessionId,
        'playerId': playerId}),options)
    .map(res => 
      res.json()); 
  }

}
