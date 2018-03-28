
import { Injectable } from '@angular/core';
import { Http,RequestOptions,RequestOptionsArgs, Headers} from '@angular/http';
import {HttpHeaders} from '@angular/common/http';

import 'rxjs/add/operator/map';

@Injectable()
export class PendingSessionsService {

  private apiUrl: string ='http://localhost:8081/';

  constructor(private http:Http) { }

  public userRegistration(playerEmail:String,playerName:String,playerImage:String){
    let headers = new Headers ({"Content-Type": "application/json"});
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.apiUrl+`primeraPrueba?`,JSON.stringify({'playerEmail':playerEmail,
    'playerName':playerName,'playerImage':playerImage}),options)
    .map(res => 
      res.json()); 
  }

}
