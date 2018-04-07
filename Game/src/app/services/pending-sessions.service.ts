
import { Injectable } from '@angular/core';
import { Http,RequestOptions,RequestOptionsArgs, Headers} from '@angular/http';
import {HttpHeaders} from '@angular/common/http';

import 'rxjs/add/operator/map';

@Injectable()
export class PendingSessionsService {

  private apiUrl: string ='http://localhost:8081/';

  constructor(private http:Http) { }

  public getPendingSessions(playerId:Number)
  {
    return this.http.get(this.apiUrl +`getPendingSessions?idPlayer=${playerId}`)
    .map(res => 
      res.json()); 
  }

  public startSession(sessionId:Number){
    return this.http.get(this.apiUrl +`startSession?idSession=${sessionId}`)
    .map(res => 
      res.json()); 
  }

}
