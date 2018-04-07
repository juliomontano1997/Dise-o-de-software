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

    return this.http.get(this.apiUrl +`getActivePlayers?idPlayer=${playerId}`)
    .map(res => 
      res.json()); 
  }

  public invitePlayer(hostPlayerId:Number,guestPlayerId:Number,boardSize:Number,amountGames:Number){
  
    return this.http.get(this.apiUrl+`newInvitation?idPlayer=${hostPlayerId}+&idRival=${guestPlayerId}
    +&boardSize=${boardSize}+&amountGames=${amountGames}`)
    .map(res => 
      res.json()); 
  }



  public inviteMachine(playerId:Number,boardSize:Number,amountGames:Number,machineLevel:Number){

    return this.http.get(this.apiUrl+`inviteMachine?idPlayer=${playerId}
    +&boardSize=${boardSize}+&amountGames=${amountGames}+&machineLevel=${machineLevel}`)
    .map(res => 
      res.json()); 
  }

}
