import { Injectable } from '@angular/core';
import { Http,RequestOptions,RequestOptionsArgs, Headers} from '@angular/http';
import {HttpClient,HttpHeaders} from '@angular/common/http';

import 'rxjs/add/operator/map';

@Injectable()
export class LoginServiceService {

  private apiUrl: string ='http://localhost:8081/';

  constructor(private http:Http) { }


  public userRegistration(playerEmail:String,playerName:String,playerImage:String){

    return this.http.get(this.apiUrl+`getPlayerId?mail=${playerEmail}+&name=${playerName}+&imageURL=${playerImage}`)
    .map(res => 
      res.json()); 
  
}

public startDemo(playerId:Number,boardSize:Number,amountGames:Number,machineLevel:Number){

  return this.http.get(this.apiUrl+`createDemoSession?idPlayer=${playerId}
    +&boardSize=${boardSize}+&amountGames=${amountGames}+&machineLevel=${machineLevel}`)
    .map(res => 
      res.json()); 

}


}