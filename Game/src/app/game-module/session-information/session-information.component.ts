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
    this.sessionInformationHandler.setPlayerPlayingId(sessionInformation.playerId);
    this.sessionInformationHandler.setSessionEnd(false);

    let data= JSON.parse(localStorage.getItem("somethingChange"));

    this.sessionInformationHandler.setAllowUpdating(data.state);
    this.getPlayersName();
    this.getSessionInformation();
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
        if (res.length > 0) {
          this.sessionInformationHandler.UpdateData(res);
        }
        else{
          //this is the end because the session was deleted;
          this.sessionEnd(true);
          alert("fin de sesion");
        }
        

      },
      (err) => {
        console.log(err.json()); 
      });
  }

  public updateSessionInformation():void {
    let id = setInterval(() => {

        if (this.sessionInformationHandler.getSessionEnd()===true){
              clearInterval(id);
        }
        else{
          this.getSessionInformation();
          this.sessionEnd(false);
        }
       
      
    }, 6000);
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
            if (res.data===false){
              //stop updating
              this.getSessionInformation();
              this.sessionEnd(false);
               
            }
            
            else{
              this.sessionInformationHandler.setSessionEnd(true);
              this.sessionEnd(true);
              alert("fin de juego");
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
