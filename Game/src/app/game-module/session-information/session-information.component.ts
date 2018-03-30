import { Component, OnInit } from '@angular/core';
import { GameViewComponent } from '../game-view/game-view.component';

import { Subscription } from 'rxjs';
import { SessionStadisticsService } from '../../services/session-stadistics.service';
import { sessionInformationHandler } from '../../models/sessionInformationHandler.model';

@Component({
  selector: 'app-session-information',
  templateUrl: './session-information.component.html',
  styleUrls: ['./session-information.component.css']
})
export class SessionInformationComponent implements OnInit {

  private sessionInformationHandler:sessionInformationHandler;

  constructor(private sessionService:SessionStadisticsService,) {
    let sessionInformation= JSON.parse(localStorage.getItem("sessionData"));
    this.sessionInformationHandler=new sessionInformationHandler(sessionInformation.sessionId);
    this.getPlayersName();
    this.updateSessionInformation();
   
  }

  ngOnInit() {
  }

  
  public getSessionInformation():void{
    this.sessionService.getStadistics(this.sessionInformationHandler.getSessionId())
    .subscribe(
      (res) =>{
        console.log(res);
        this.sessionInformationHandler.UpdateData(res);
      },
      (err) => {
        console.log(err.json()); 
      });
  }

  public updateSessionInformation():void{
    let id = setInterval(() => {
      if (this.sessionInformationHandler.getAllowUpdating()===true){
        this.getSessionInformation();
      }
      else{
        clearInterval(id);
      }
    }, 3000);
  }

  public getPlayersName(): void{

    this.sessionService.getSessionNames(this.sessionInformationHandler.getSessionId())
    .subscribe(
      (res) =>{

        this.sessionInformationHandler.setPlayersNameData(res);
      },
      (err) => {
        console.log(err.json()); 
      });

    }

    public giveUp(){
        this.sessionService.giveUp(this.sessionInformationHandler.getSessionId())
        .subscribe(
          (res) =>{
    
            console.log(res);
          },
          (err) => {
            console.log(err.json()); 
          });

    }

    public passTurn(){
      this.sessionService.passTurn(this.sessionInformationHandler.getSessionId())
        .subscribe(
          (res) =>{
            console.log(res);
          },
          (err) => {
            console.log(err.json()); 
          });
    }

}
