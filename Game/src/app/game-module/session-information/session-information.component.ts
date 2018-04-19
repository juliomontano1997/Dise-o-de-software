import { Component, OnInit } from '@angular/core';
import { GameViewComponent } from '../game-view/game-view.component';

import { Subscription } from 'rxjs';
import { userNotificationsHandler } from '../../models/userNotificationsHandler.model';
import { SessionStadisticsService } from '../../services/session-stadistics.service';
import { sessionInformationHandler } from '../../models/sessionInformationHandler.model';

@Component({
  selector: 'app-session-information',
  templateUrl: './session-information.component.html',
  styleUrls: ['./session-information.component.css']
})
export class SessionInformationComponent implements OnInit {

  private sessionInformationHandler:sessionInformationHandler;
  private userNotices:userNotificationsHandler;

  constructor(private sessionService:SessionStadisticsService,) {
    let sessionInformation= JSON.parse(localStorage.getItem("sessionData"));
    this.sessionInformationHandler=new sessionInformationHandler(sessionInformation.sessionId);
    this.sessionInformationHandler.setPlayerPlayingId(sessionInformation.playerId);
    this.sessionInformationHandler.setSessionEnd(false);
    this.userNotices= new userNotificationsHandler();
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

  public finishGame(){
    let message:String= this.sessionInformationHandler.getWinner();
    this.userNotices.notify(3,message,"Fin de sesión");
    this.sessionService.getFinishSession(this.sessionInformationHandler.getSessionId()).subscribe(
      (res) =>{
        window.location.href='profileModule';
      },
      (err) => {
        console.log(err.json()); 
      });

  }

  public getSessionInformation():void{
    this.sessionService.getStadistics(this.sessionInformationHandler.getSessionId())
    .subscribe(
      (res) =>{
        console.log(res);
        if (res.length > 0) {
          if (res[0].o_amountgames < res[0].o_numberactualgame){
            this.sessionInformationHandler.setWinsPlayerOne(res[0].o_winsplayer1);
            this.sessionInformationHandler.setWinsPlayerTwo(res[0].o_winsplayer2);
            this.sessionInformationHandler.setTiesNumber(res[0].o_ties);
            setTimeout(() => {
              this.finishGame();
            }, 500);
            
          }
          else{
            
            this.sessionInformationHandler.UpdateData(res);
          }
 
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
            if (res.data===true){
              //stop updating
              this.getSessionInformation();
              this.sessionEnd(false);
            }
            
            
          },
          (err) => {
            console.log(err.json()); 
          });

    }

    public passTurn(){
      this.sessionService.passTurn(this.sessionInformationHandler.getSessionId(),
      this.sessionInformationHandler.getPlayerPlayingId())
        .subscribe(
          (res) =>{

          },
          (err) => {
            console.log(err.json()); 
          });
    }

    

}
