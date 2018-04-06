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
    //this.sessionInformationHandler=new sessionInformationHandler(sessionInformation.sessionId);
    //this.sessionInformationHandler.setPlayerPlayingId(sessionInformation.playerId);
       // let sessionInformation= JSON.parse(localStorage.getItem("sessionData"));
    //this.sessionHandler= new boardSessionHandler(sessionInformation.sessionId,sessionInformation.playerId);
    this.sessionInformationHandler=new sessionInformationHandler(4);
    this.sessionInformationHandler.setSessionEnd(false);
    //let data= JSON.parse(localStorage.getItem("somethingChange"));
    this.sessionInformationHandler.setAllowUpdating(true);
    this.getPlayersName();
    this.updateSessionInformation();
   
  }

  ngOnInit() {
  }

  
  public sessionEnd(state:Boolean){
    //session end
      if (state===true){
        localStorage.setItem("notUpdate",JSON.stringify({"state":true}));      
      }
      localStorage.setItem("somethingChange",JSON.stringify({"state":false}));
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

  public updateSessionInformation():void {
    let id = setInterval(() => {

      //this.sessionInformationHandler.setAllowUpdating(JSON.parse(localStorage.getItem("somethingChange")).state);
      if (this.sessionInformationHandler.getAllowUpdating()===true){
        this.getSessionInformation();
      }

      else{
        if (this.sessionInformationHandler.getSessionEnd()===true){
              clearInterval(id);
        }
       
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
        this.sessionService.giveUp(this.sessionInformationHandler.getSessionId()
      ,this.sessionInformationHandler.getPlayerPlayingId(), this.sessionInformationHandler.getAmountGamesNumber(), 
      this.sessionInformationHandler.getCurrentGameNumber())
        .subscribe(
          (res) =>{
    
            //if the session is not ended
            if (res.mg_finishSession===true){
              //stop updating
              this.sessionEnd(false);
              this.updateSessionInformation();
              
            }
            else{
              this.sessionInformationHandler.setSessionEnd(true);
              this.sessionEnd(true);
              //determinar quien ganó el juego.
            }
            
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
