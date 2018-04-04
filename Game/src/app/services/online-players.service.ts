import { Injectable } from '@angular/core';
import { Http,RequestOptions,RequestOptionsArgs, Headers} from '@angular/http';
import {HttpHeaders} from '@angular/common/http';

import 'rxjs/add/operator/map';

@Injectable()
export class OnlinePlayersService {


  private apiUrl: string ='http://localhost:8081/';

  constructor(private http:Http) { 

  }

  public getPlayers(playerId:Number){

    return this.http.get(this.apiUrl +`onlinePlayers?playerId=${playerId}`)
    .map(res => 
      res.json()); 
  }

  public invitePlayer(hostPlayerId:Number,guestPlayerId:Number,boardSize:Number,amountGames:Number){
    let headers = new Headers ({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.apiUrl+`invitePlayer?`,JSON.stringify({'transmitterID':hostPlayerId,
    'receiverID':guestPlayerId,'boardSize':boardSize,"amountGames":amountGames}),options)
    .map(res => 
      res.json()); 
  }

  public inviteMachine(playerId:Number,boardSize:Number,amountGames:Number,machineLevel:Number){
    let headers = new Headers ({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.apiUrl+`inviteMachine?`,JSON.stringify({'playerId':playerId,
    'boardSize':boardSize,'amountGames':amountGames,'machineLevel':machineLevel}),options)
    .map(res => 
      res.json()); 
  }

}
